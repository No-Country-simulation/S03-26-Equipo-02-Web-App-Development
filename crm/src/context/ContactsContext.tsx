// ─── ContactsContext.tsx ──────────────────────────────────────────────────────
// Este archivo crea el "contexto global" de contactos para toda la aplicación.
// Usando React Context, cualquier componente puede leer y modificar la lista
// de contactos sin necesitar pasarla como prop de padre a hijo.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useState, useEffect } from 'react';

// ─── Interfaz Contact ────────────────────────────────────────────────────────
// Define la forma (shape) de un objeto contacto.
// Cada campo tiene su tipo TypeScript para que no se pueda cargar un dato incorrecto.
export interface Contact {
  id: number;       // Identificador único numérico del contacto
  name: string;     // Nombre completo del contacto
  email: string;    // Correo electrónico
  phone: string;    // Teléfono de contacto
  status: string;   // Estado en el funnel: "Cliente" o "Prospecto"
  tags: string[];   // Etiquetas asociadas al contacto (ej: ["VIP", "Tech"])
}

// ─── Interfaz del contexto ───────────────────────────────────────────────────
// Define qué valores expone el contexto a los componentes que lo consuman.
export interface ContactsContextType {
  contacts: Contact[];                                            // Lista de todos los contactos
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;  // Función para actualizar la lista completa
}

// ─── Datos iniciales (mock) ──────────────────────────────────────────────────
// Lista de contactos de ejemplo que se cargan si no hay datos guardados en localStorage.
// Estos son datos ficticios solo para desarrollo/demostración.
const initialContacts: Contact[] = [
  { id: 1, name: 'David Park',      email: 'david.park@techcorp.com',   phone: '+1 234-567-8901', status: 'Cliente',   tags: ['VIP', 'Tech'] },
  { id: 2, name: 'Sarah Johnson',   email: 'sarah.j@designco.io',       phone: '+1 987-654-3210', status: 'Prospecto', tags: ['Diseño'] },
  { id: 3, name: 'Michael Chen',    email: 'm.chen@innovatex.net',       phone: '+1 555-123-4567', status: 'Cliente',   tags: ['Tech', 'Lead'] },
  { id: 4, name: 'Emma Davis',      email: 'emma@globalreach.co',        phone: '+1 888-999-0000', status: 'Prospecto', tags: ['Ventas'] },
  { id: 5, name: 'James Wilson',    email: 'jwilson@nextgen.com',        phone: '+1 444-555-6666', status: 'Cliente',   tags: ['Finanzas'] },
  { id: 6, name: 'Olivia Martinez', email: 'olivia.m@startupinc.com',   phone: '+1 222-333-4444', status: 'Prospecto', tags: ['Startup'] },
];

// ─── Creación del contexto ───────────────────────────────────────────────────
// createContext crea el "contenedor" global. Arranca como undefined
// hasta que el Provider lo envuelva con sus valores reales.
const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

// Se exporta el contexto para que useContacts.ts pueda importarlo
export { ContactsContext };

// ─── Provider ────────────────────────────────────────────────────────────────
// ContactsProvider es el componente que envuelve toda la app (montado en App.tsx).
// Todo componente hijo puede acceder a contacts y setContacts desde aquí.
export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Estado principal: lista de contactos
  // Se inicializa con una función lazy para leer de localStorage primero.
  // Si hay datos guardados se usan esos; si no, se usan los contactos mock iniciales.
  const [contacts, setContacts] = useState<Contact[]>(() => {
    if (typeof window === 'undefined') return initialContacts; // Entorno sin browser (SSR): usar mock directo
    try {
      const stored = window.localStorage.getItem('crm_contacts'); // Buscar datos guardados previamente
      return stored ? (JSON.parse(stored) as Contact[]) : initialContacts; // Parsear o usar mock
    } catch {
      return initialContacts; // Si localStorage falla (JSON corrupto, etc.), usar mock
    }
  });

  // Efecto de sincronización: cada vez que cambia la lista de contactos,
  // se guarda automáticamente en localStorage para persistir entre recargas.
  useEffect(() => {
    if (typeof window === 'undefined') return; // No ejecutar en entornos sin browser
    window.localStorage.setItem('crm_contacts', JSON.stringify(contacts)); // Serializar y guardar
  }, [contacts]); // Solo corre cuando `contacts` cambia

  // El Provider envuelve a todos los componentes hijos y les da acceso
  // al estado `contacts` y a la función `setContacts` para modificarlo.
  return (
    <ContactsContext.Provider value={{ contacts, setContacts }}>
      {children}
    </ContactsContext.Provider>
  );
};
