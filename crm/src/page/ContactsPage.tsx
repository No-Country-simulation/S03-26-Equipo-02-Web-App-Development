import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Download,
  Filter,
  ChevronDown,
  MessageSquare,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import type { ApiContact } from "@/types/ApiContacts";
import ExportModal from "@/components/modals/ExportModal";
import AddContacModal from "@/components/modals/AddContacModal";

export default function ContactsPage() {
  const navigate = useNavigate();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contacts, setContactsTest] = useState<ApiContact[]>([]);

  useEffect(() => {
    fetch("https://s03-26-equipo-02-web-app-development.onrender.com/contacts")
      .then((res) => res.json())
      .then((json) => setContactsTest(json.data));
  }, []);

  const filteredContacts = contacts.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  const toggleSelectContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id],
    );
  };

  const handleDeleteContact = async (id: string): Promise<void> => {
    try {
      const response = await fetch(
        `https://s03-26-equipo-02-web-app-development.onrender.com/contacts/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Error al eliminar contacto");
      }
      setContactsTest((prev) => prev.filter((c) => c.id !== id));
      setSelectedContacts((prev) => prev.filter((cId) => cId !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative h-full overflow-y-auto p-6 lg:p-8 bg-[#FAFAFA] custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Contactos
          </h1>
          <p className="text-sm font-semibold text-slate-600 mt-1">
            Gestiona tus {contacts.length} contactos y prospectos
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-11 px-5 bg-[#0D9488] text-white rounded-lg shadow-sm flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#0f766c] transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Agregar Contacto
        </button>
        <AddContacModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onContactCreated={(newContact) =>
            setContactsTest((prev) => [newContact, ...prev])
          }
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-[#F1F5F9]/50 border-none rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="h-11 px-4 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center gap-6 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                Todos
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="h-11 px-6 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Exportar
          </button>
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-50">
                <th className="py-4 px-6 w-10">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedContacts.length === filteredContacts.length &&
                        filteredContacts.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-200 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                    />
                  </div>
                </th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">
                  Estado
                </th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">
                  Etiquetas
                </th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelectContact(contact.id)}
                        className="w-4 h-4 rounded border-slate-200 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-slate-100 flex items-center justify-center">
                        <span className="text-[13px] font-bold text-slate-900 uppercase">
                          {contact.firstName[0]}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">
                          {contact.firstName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-500">
                            0 sin leer
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-600">
                        {contact.email || "Sin email"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-600">
                        {contact.phone || "Sin teléfono"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {contact.phone ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-extrabold bg-[#0D9488] text-white shadow-sm shadow-[#0D9488]/10">
                          Whatsapp
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-extrabold bg-white border border-slate-100 text-slate-700 shadow-sm">
                          Email
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5">prueba</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer outline-none">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-1">
                        <DropdownMenuItem
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                          className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-slate-50"
                        >
                          <Eye className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-bold text-slate-700">
                            Ver Detalles
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/tray?id=${contact.id}`)}
                          className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-slate-50"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-bold text-slate-700">
                            Enviar Mensaje
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-slate-50">
                          <Pencil className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-bold text-slate-700">
                            Editar
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-slate-50" />
                        <DropdownMenuItem
                          className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                          onClick={() => {
                            handleDeleteContact(contact.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                          <span className="text-sm font-bold">Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredContacts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-500">
                No se encontraron contactos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
