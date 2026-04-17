// ─── useContacts.ts ───────────────────────────────────────────────────────────
// Hook personalizado (custom hook) que simplifica el acceso al ContactsContext.
// En lugar de usar useContext(ContactsContext) directamente en cada componente,
// los componentes simplemente llaman: const { contacts, setContacts } = useContacts()
// ─────────────────────────────────────────────────────────────────────────────

import { useContext } from 'react';
import { ContactsContext } from './ContactsContext'; // Importa el contexto creado en ContactsContext.tsx

export const useContacts = () => {
  // useContext busca el ContactsContext más cercano en el árbol de componentes.
  // Devuelve el valor que el Provider (ContactsProvider) esté exponiendo en ese momento.
  const context = useContext(ContactsContext);

  // Guard clause: si se intenta usar este hook fuera de un ContactsProvider,
  // el contexto devuelve undefined. En ese caso lanzamos un error claro
  // en lugar de dejar que la app falle silenciosamente con un undefined.
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }

  // Si el contexto existe, lo retornamos con contacts y setContacts disponibles
  return context;
};