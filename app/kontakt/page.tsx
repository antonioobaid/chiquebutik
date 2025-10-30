'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ContactInfo } from '@/types/types';
import { motion } from 'framer-motion';

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
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-600 dark:text-gray-300">
        Laddar kontaktinformation...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 border border-gray-100 dark:border-gray-700"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white text-center">
          Kontakta Oss
        </h1>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm"
          >
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">🏢 Företag</p>
            <p className="mt-1">{contact.company}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm"
          >
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">📍 Adress</p>
            <p className="mt-1">{contact.address}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm"
          >
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">📞 Telefon</p>
            <p className="mt-1">{contact.phone}</p>
          </motion.div>

          {/* Email-fält */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm"
          >
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">📧 Email</p>
            <p className="mt-1">{contact.email}</p>
          </motion.div>

          {/* Öppettider sist */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm"
          >
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">⏰ Öppettider</p>
            <ul className="mt-1 space-y-1">
              <li>{contact.opening_hours}</li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-10 text-center text-gray-500 dark:text-gray-400 text-sm">
          Tack för att du kontaktar oss 💬<br />
        </div>
      </motion.div>
    </div>
  );
}
