'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ContactInfo } from '@/types/types';

export default function ContactPage() {
  const [contact, setContact] = useState<ContactInfo | null>(null);

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

  if (!contact) {
    return <p className="text-center mt-20 text-gray-600">Laddar kontaktinformation...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md my-8 ">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Kontakt</h1>

      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🏢</span>
          <p className="font-medium">{contact.company}</p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-2xl">📍</span>
          <p>{contact.address}</p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-2xl">📞</span>
          <p>{contact.phone}</p>
        </div>

        <div className="flex items-start space-x-3">
          <span className="text-2xl">⏰</span>
          <div>
            <p className="font-medium">Öppettider:</p>
            <ul className="list-disc list-inside">
              <li> {contact.opening_hours}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
