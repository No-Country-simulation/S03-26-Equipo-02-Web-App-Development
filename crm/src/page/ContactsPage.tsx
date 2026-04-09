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
  HelpCircle,
  Check,
  X,
  FileText,
  Table as TableIcon,
  Eye,
  MessageSquareText,
  Pencil,
  Trash2,
} from "lucide-react";
import { useContacts } from "@/context/useContacts";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function ContactsPage() {
  const navigate = useNavigate();
  const { contacts, setContacts } = useContacts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"CSV" | "PDF">("CSV");
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
  });
  const [notification, setNotification] = useState<{
    show: boolean;
    format: string;
    message?: string;
  }>({ show: false, format: "", message: "" });

  // Filter contacts based on search
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id));
    }
  };

  const toggleSelectContact = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    setNotification({
      show: true,
      format: selectedFormat,
      message: "Puedes visualizarlo en tus descargas."
    });
    setIsExportModalOpen(false);
  };

  const handleAddContact = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.status) return;

    const newContact = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      tags: ["Nuevo"],
    };

    setContacts([newContact, ...contacts]);
    setIsAddModalOpen(false);
    setFormData({ name: "", email: "", phone: "", status: "" });

    setNotification({
      show: true,
      format: "CONTACTO",
      message: "El contacto ha sido agregado exitosamente."
    });
  };

  const handleDeleteContact = (id: number) => {
    const contactToDelete = contacts.find(c => c.id === id);
    setContacts(contacts.filter(c => c.id !== id));
    setNotification({
      show: true,
      format: "ELIMINADO",
      message: `El contacto ${contactToDelete?.name} ha sido eliminado.`
    });
  };

  return (
    <div className="relative h-full overflow-y-auto p-6 lg:p-8 bg-[#FAFAFA] custom-scrollbar">
      {/* Toast Notification */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className={cn(
            "border rounded-xl p-4 shadow-lg min-w-[320px] relative flex items-start gap-3",
            notification.format === "ELIMINADO" ? "bg-rose-50 border-rose-100" : "bg-[#ECFDF5] border-[#A7F3D0]"
          )}>
            <div className={cn(
              "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
              notification.format === "ELIMINADO" ? "bg-rose-100" : "bg-emerald-100"
            )}>
              {notification.format === "ELIMINADO" ? (
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
              )}
            </div>
            <div className="flex flex-col flex-1">
              <h4 className="text-sm font-bold text-slate-800">
                {notification.format === "CONTACTO" && "Contacto agregado"}
                {notification.format === "ELIMINADO" && "Contacto eliminado"}
                {notification.format !== "CONTACTO" && notification.format !== "ELIMINADO" && `${notification.format} descargado correctamente`}
              </h4>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 duration-200 relative p-8">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-[#E11D48] text-white rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[3px]" />
            </button>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900">Exportar Contactos</h3>
              <p className="text-sm font-semibold text-slate-500 mt-1">Selecciona el formato de exportación para las métricas y datos</p>
            </div>

            <div className="space-y-4 mb-8">
              {/* Opción CSV */}
              <div
                onClick={() => setSelectedFormat("CSV")}
                className={cn(
                  "p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                  selectedFormat === "CSV"
                    ? "bg-[#ECFDF5] border-[#0D9488]/30 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                  selectedFormat === "CSV" ? "bg-[#0D9488] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                )}>
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Exportar como CSV</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Formato compatible con Excel y hojas de cálculo</p>
                </div>
              </div>

              {/* Opción PDF */}
              <div
                onClick={() => setSelectedFormat("PDF")}
                className={cn(
                  "p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                  selectedFormat === "PDF"
                    ? "bg-[#ECFDF5] border-[#0D9488]/30 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                  selectedFormat === "PDF" ? "bg-[#0D9488] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                )}>
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Exportar como PDF</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Documento imprimible con formato profesional</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full py-4 bg-[#0D9488] text-white rounded-xl text-sm font-bold hover:bg-[#0f766c] shadow-lg shadow-[#0D9488]/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              Descargar
            </button>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Agregar Nuevo Contacto</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">Agrega un nuevo contacto a tu lista.</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-10 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Nombre</label>
                  <input
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/24 focus:ring-4 focus:ring-[#0D9488]/24 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Email</label>
                  <input
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/24 focus:ring-4 focus:ring-[#0D9488]/24 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+54 11-68367166"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/24 focus:ring-4 focus:ring-[#0D9488]/24 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Estado</label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/24 focus:ring-4 focus:ring-[#0D9488]/24 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Seleccionar Estado</option>
                      <option value="Cliente" className="text-slate-700">Cliente</option>
                      <option value="Prospecto" className="text-slate-700">Prospecto</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAddContact}
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.status}
                    className={cn(
                      "w-full h-12 rounded-xl text-sm font-bold transition-all",
                      formData.name && formData.email && formData.phone && formData.status
                        ? "bg-[#0D9488] text-white hover:bg-[#0f766c] shadow-lg shadow-[#0D9488]/20 cursor-pointer active:scale-[0.98]"
                        : "bg-[#F1F5F9] text-slate-400 cursor-not-allowed"
                    )}
                  >
                    Agregar Contacto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                        selectedContacts.length === filteredContacts.length && filteredContacts.length > 0
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
                          {contact.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">
                          {contact.name}
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
                        {contact.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-600">
                        {contact.phone}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                       <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-extrabold bg-[#0D9488] text-white shadow-sm shadow-[#0D9488]/10">
                        {contact.status}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-extrabold bg-white border border-slate-100 text-slate-700 shadow-sm">
                        Whatsapp
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-slate-600 whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
                          <span className="text-sm font-bold text-slate-700">Ver Detalles</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/tray?id=${contact.id}`)}
                          className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-slate-50"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-bold text-slate-700">Enviar Mensaje</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-slate-50">
                          <Pencil className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-bold text-slate-700">Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 bg-slate-50" />
                        <DropdownMenuItem
                          onClick={() => handleDeleteContact(contact.id)}
                          className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors"
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
              <p className="text-sm font-semibold text-slate-500">No se encontraron contactos.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0D9488] rounded-full shadow-lg hover:shadow-xl hover:bg-[#0f766c] transition-all flex items-center justify-center z-50 cursor-pointer">
        <HelpCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
