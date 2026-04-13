import React, { createContext, useState, useEffect } from 'react';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  tags: string[];
}

export interface ContactsContextType {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

const initialContacts: Contact[] = [
  { id: 1, name: 'David Park', email: 'david.park@techcorp.com', phone: '+1 234-567-8901', status: 'Cliente', tags: ['VIP', 'Tech'] },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@designco.io', phone: '+1 987-654-3210', status: 'Prospecto', tags: ['Diseño'] },
  { id: 3, name: 'Michael Chen', email: 'm.chen@innovatex.net', phone: '+1 555-123-4567', status: 'Cliente', tags: ['Tech', 'Lead'] },
  { id: 4, name: 'Emma Davis', email: 'emma@globalreach.co', phone: '+1 888-999-0000', status: 'Prospecto', tags: ['Ventas'] },
  { id: 5, name: 'James Wilson', email: 'jwilson@nextgen.com', phone: '+1 444-555-6666', status: 'Cliente', tags: ['Finanzas'] },
  { id: 6, name: 'Olivia Martinez', email: 'olivia.m@startupinc.com', phone: '+1 222-333-4444', status: 'Prospecto', tags: ['Startup'] },
];

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export { ContactsContext };

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    if (typeof window === 'undefined') return initialContacts;
    try {
      const stored = window.localStorage.getItem('crm_contacts');
      return stored ? (JSON.parse(stored) as Contact[]) : initialContacts;
    } catch {
      return initialContacts;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('crm_contacts', JSON.stringify(contacts));
  }, [contacts]);

  return (
    <ContactsContext.Provider value={{ contacts, setContacts }}>
      {children}
    </ContactsContext.Provider>
  );
};
