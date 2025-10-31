// app/kontakt/page.tsx - Uppdaterad version med embedded Google Maps
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ContactInfo } from '@/types/types';
import { motion } from 'framer-motion';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// FAQ data
const faqs = [
  {
    question: "Hur lång leveranstid har ni?",
    answer: "Vanligtvis 2-3 arbetsdagar för produkter i lager. För specialbeställningar kan det ta upp till 7 arbetsdagar."
  },
  {
    question: "Kan jag returnera en produkt?",
    answer: "Ja, vi har 30 dagars öppet köp på alla produkter. Produkten måste vara oanvänd och i originalförpackning."
  },
  {
    question: "Erbjuder ni internationell leverans?",
    answer: "För närvarande levererar vi endast inom Sverige. Vi arbetar på att expandera vår leverans till andra länder."
  },
  {
    question: "Vilka betalningsmetoder accepterar ni?",
    answer: "Vi accepterar kortbetalning (Visa, Mastercard), Swish, Klarna och PayPal."
  },
  {
    question: "Kan jag ändra min storlek efter att jag beställt?",
    answer: "Kontakta oss omedelbart om du vill ändra storlek. Om ordern inte redan skickats kan vi ofta hjälpa dig."
  }
];

export default function ContactPage() {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchContact() {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .limit(1)
        .single<ContactInfo>();

      if (error) console.error(error);
      else setContact(data);
    }

    fetchContact();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/kontakt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        console.error('API Error:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (!contact) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-600 dark:text-gray-300">
        Laddar kontaktinformation...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Google Maps Section - NYTT: Täcker hela bredden högst upp */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-96 lg:h-[500px]"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2038.5699999999997!2d18.063999999999993!3d59.31999999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f77e7c3c15b8f%3A0x7a1d6e9c7b1a1a1a!2sStockholm%2C%20Sweden!5e0!3m2!1sen!2sse!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
          title="ChiqueButik Location"
        />
      </motion.div>

      {/* Resten av innehållet */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Kontakta Oss
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hitta oss enkelt eller skicka ett meddelande - vi hjälper dig gärna!
            </p>
          </motion.div>

          {/* Snabb kontaktinfo under kartan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Snabbkontakt
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl text-blue-600">📍</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Adress</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{contact.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-2xl text-green-600">📞</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Telefon</p>
                    <p className="text-gray-600 dark:text-gray-300">{contact.phone}</p>
                  </div>
                </div>
                
                {contact.email && (
                  <div className="flex items-center space-x-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <div className="text-2xl text-orange-600">📧</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{contact.email}</p>
                    </div>
                  </div>
                )}

                {/* Instagram länk */}
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl">
                  <div className="text-2xl text-pink-600">📱</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Följ oss</p>
                    <a 
                      href="https://www.instagram.com/chiquebutik.se/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 transition flex items-center space-x-1 text-sm"
                    >
                      <span>@chiquebutik.se</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Huvudinnehåll - Kontaktformulär och information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vänster kolumn - Kontaktformulär */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Skicka ett meddelande
                </h2>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg text-green-700 dark:text-green-300"
                  >
                    ✅ Tack för ditt meddelande! Vi återkommer så snart som möjligt.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded-lg text-red-700 dark:text-red-300"
                  >
                    ❌ Något gick fel. Försök igen eller kontakta oss direkt via email/telefon.
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Namn *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                        placeholder="Ditt namn"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                        placeholder="din.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ämne *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                      placeholder="Vad gäller ditt ärende?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meddelande *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition resize-none"
                      placeholder="Berätta hur vi kan hjälpa dig..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Skickar...
                      </span>
                    ) : (
                      'Skicka meddelande'
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Ytterligare kontaktinformation under formuläret */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Ytterligare information
                </h2>

                <div className="space-y-6">
                  <motion.div whileHover={{ scale: 1.02 }} className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="text-2xl">🏢</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Företag</p>
                      <p className="text-gray-600 dark:text-gray-300">{contact.company}</p>
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="flex items-start space-x-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                    <div className="text-2xl">⏰</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Öppettider</p>
                      <p className="text-gray-600 dark:text-gray-300">{contact.opening_hours}</p>
                    </div>
                  </motion.div>

                  <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">💡 Behöver du snabb hjälp?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Ring oss direkt eller skicka ett meddelande - vi svarar så snart vi kan!
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Höger kolumn - FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              {/* FAQ Sektion */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Vanliga frågor
                </h2>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex justify-between items-center"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </span>
                        <motion.span
                          animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-500"
                        >
                          ▼
                        </motion.span>
                      </button>
                      
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: openFaqIndex === index ? 'auto' : 0,
                          opacity: openFaqIndex === index ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-gray-600 dark:text-gray-300">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Media sektion */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Följ oss
                </h2>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    @chiquebutik.se
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Följ oss på Instagram för senaste nytt, erbjudanden och inspiration!
                  </p>
                  <a 
                    href="https://www.instagram.com/chiquebutik.se/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all"
                  >
                    <span>Följ på Instagram</span>
                    <span>→</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}