// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServerClient';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
let resend: unknown = null;

if (RESEND_API_KEY) {
  try {
    // Använd dynamisk import istället för require
    const { Resend } = await import('resend');
    resend = new Resend(RESEND_API_KEY);
    console.log('✅ Resend initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Resend:', error);
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validera input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Alla fält är obligatoriska' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ogiltig email-adress' },
        { status: 400 }
      );
    }

    // Spara meddelandet i Supabase
    const { data, error } = await supabaseServer
      .from('contact_messages')
      .insert([{ 
        name: name.trim(), 
        email: email.trim(), 
        subject: subject.trim(), 
        message: message.trim() 
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Kunde inte spara meddelandet' },
        { status: 500 }
      );
    }

    console.log('📦 Meddelande sparat i Supabase med ID:', data[0].id);

    // 🔥 SKICKA EMAIL - UPPDATERAD KOD
    if (resend) {
      try {
        console.log('🔄 Försöker skicka email...');
        
        // Type assertion för Resend instance
        const resendInstance = resend as { emails: { send: (options: any) => Promise<any> } };
        
        // Skicka till ägaren
        const ownerResult = await resendInstance.emails.send({
          from: 'ChiqueButik <onboarding@resend.dev>',
          to: process.env.YOUR_EMAIL!,
          replyTo: email,
          subject: `📨 Nytt meddelande från ${name}: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">Nytt kontaktmeddelande!</h2>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>👤 Från:</strong> ${name}</p>
                <p><strong>📧 Email:</strong> ${email}</p>
                <p><strong>📝 Ämne:</strong> ${subject}</p>
                <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4F46E5;">
                  <strong>💬 Meddelande:</strong><br>
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              <p style="color: #64748b; font-size: 12px;">
                <strong>💡 Tips:</strong> Klicka "Svara" för att svara direkt till ${name}!
              </p>
              <p style="color: #64748b; font-size: 12px;">
                Skickat: ${new Date().toLocaleString('sv-SE')}
              </p>
            </div>
          `
        });

        console.log('✅ Email skickat till ägare! Response:', ownerResult);

        // Skicka bekräftelse till kunden
        try {
          const customerResult = await resendInstance.emails.send({
            from: 'ChiqueButik <onboarding@resend.dev>',
            to: email,
            subject: 'Tack för ditt meddelande till ChiqueButik!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Tack för ditt meddelande!</h2>
                <p>Hej <strong>${name}</strong>,</p>
                <p>Vi har mottagit ditt meddelande och återkommer så snart som möjligt.</p>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>📋 Sammanfattning av ditt ärende:</strong></p>
                  <p><strong>Ämne:</strong> ${subject}</p>
                  <p><strong>Ditt meddelande:</strong> ${message.substring(0, 150)}${message.length > 150 ? '...' : ''}</p>
                </div>

                <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>📞 Behöver du snabb hjälp?</strong></p>
                  <p>Ring oss direkt på vår kundtjänst för akuta ärenden.</p>
                </div>

                <p>Med vänliga hälsningar,<br>
                <strong>Teamet på ChiqueButik</strong></p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 12px;">
                  Detta är ett automatiskt meddelande. Svara inte på detta email.
                </p>
              </div>
            `
          });

          console.log('✅ Bekräftelse skickad till kund! Response:', customerResult);

        } catch (customerError: unknown) {
          const errorMessage = customerError instanceof Error 
            ? customerError.message 
            : 'Unknown error occurred';
          console.error('❌ Kunde inte skicka bekräftelse till kund:', errorMessage);
        }

      } catch (emailError: unknown) {
        const errorMessage = emailError instanceof Error 
          ? emailError.message 
          : 'Unknown error occurred';
        console.error('❌ EMAIL FEL:', errorMessage);
      }
    } else {
      console.log('📧 RESEND EJ TILLGÄNGLIG - Testläge');
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Tack för ditt meddelande! Vi återkommer så snart som möjligt.',
        messageId: data[0].id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod när meddelandet skulle skickas' },
      { status: 500 }
    );
  }
}