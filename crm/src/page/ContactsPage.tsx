// ─── ContactsPage.tsx ─────────────────────────────────────────────────────────
// Página principal de gestión de contactos del CRM.
// Muestra la tabla de contactos, permite buscar, filtrar, exportar,
// agregar nuevos contactos y eliminar existentes.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Hook para navegar entre rutas
import {
  Search,        // Icono de lupa para el buscador
  Plus,          // Icono "+" para el botón de agregar
  MoreHorizontal,// Icono "..." para el menú de acciones por fila
  Mail,          // Icono sobre para mostrar el email
  Phone,         // Icono teléfono
  Download,      // Icono de descarga para exportar
  Filter,        // Icono de filtro
  ChevronDown,   // Icono flecha hacia abajo para el select de estado
  MessageSquare, // Icono de mensaje (mensajes sin leer)
  HelpCircle,    // Icono de ayuda para el botón flotante
  Check,         // Icono de tilde para la notificación de éxito
  X,             // Icono de cruz para cerrar modales y notificaciones
  Eye,           // Icono de ojo para "Ver Detalles"
  Pencil,        // Icono de lápiz para "Editar"
  Trash2,        // Icono de tacho para "Eliminar"
} from "lucide-react";

import { useContacts } from "@/context/useContacts"; // Hook que provee contacts y setContacts desde el contexto global
import { cn } from "@/lib/utils";                    // Utilitario para combinar clases CSS condicionalmente
import {
  DropdownMenu,          // Contenedor del menú desplegable de acciones
  DropdownMenuTrigger,   // El botón que abre el menú
  DropdownMenuContent,   // El panel que aparece con las opciones
  DropdownMenuItem,      // Una opción individual dentro del menú
  DropdownMenuSeparator, // Línea separadora entre opciones del menú
} from "@/components/ui/dropdown-menu";

export default function ContactsPage() {
  const navigate = useNavigate(); // Función para redirigir a otras rutas (ej: al perfil del contacto)

  // ─── Datos globales de contactos ────────────────────────────────────────────
  // contacts: array con todos los contactos actuales
  // setContacts: función para reemplazar/actualizar la lista completa
  // Vienen del ContactsContext (guardado en localStorage)
  const { contacts, setContacts } = useContacts();

  // ─── Estado local de la página ───────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");             // Texto ingresado en el buscador
  const [isExportModalOpen, setIsExportModalOpen] = useState(false); // Controla si el modal de exportar está abierto
  const [selectedFormat, setSelectedFormat] = useState<"CSV" | "PDF">("CSV"); // Formato elegido para exportar
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]); // IDs de los contactos seleccionados con checkbox
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);  // Controla si el modal de agregar contacto está abierto

  // Datos del formulario para crear un nuevo contacto
  const [formData, setFormData] = useState({
    name: "",    // Nombre completo del nuevo contacto
    email: "",   // Email del nuevo contacto
    phone: "",   // Teléfono del nuevo contacto
    status: "",  // Estado elegido: "Cliente" o "Prospecto"
  });

  // Estado de la notificación toast (la tarjetita que aparece arriba a la derecha)
  const [notification, setNotification] = useState<{
    show: boolean;    // Si la notificación es visible o no
    format: string;   // Tipo: "CONTACTO" | "ELIMINADO" | "CSV" | "PDF"
    message?: string; // Texto descriptivo secundario
  }>({ show: false, format: "", message: "" });

  // ─── Filtrado de contactos ───────────────────────────────────────────────────
  // Filtra el array completo de contactos según lo que escribió el usuario en el buscador.
  // Busca coincidencia en el nombre O en el email (sin distinguir mayúsculas).
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── Auto-ocultar notificación ───────────────────────────────────────────────
  // Cuando aparece una notificación (show=true), se inicia un temporizador de 5 segundos.
  // Al vencer, la notificación se oculta automáticamente.
  // Si el componente se desmonta antes de los 5s, clearTimeout evita memory leaks.
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false }); // Ocultar la notificación
      }, 5000); // 5000 ms = 5 segundos
      return () => clearTimeout(timer); // Limpieza del timer al desmontar
    }
  }, [notification]);

  // ─── Selección masiva de contactos ──────────────────────────────────────────
  // Si ya están todos seleccionados → deselecciona todos.
  // Si no → selecciona todos los contactos de la lista filtrada actual.
  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]); // Deseleccionar todos
    } else {
      setSelectedContacts(filteredContacts.map((c) => c.id)); // Seleccionar todos los IDs filtrados
    }
  };

  // ─── Selección individual de un contacto ─────────────────────────────────────
  // Si el ID ya está en el array → lo quita (deselecciona).
  // Si no está → lo agrega (selecciona).
  const toggleSelectContact = (id: number) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  // ─── Exportar contactos ──────────────────────────────────────────────────────
  // Muestra la notificación con el formato elegido (CSV o PDF) y cierra el modal.
  // (La descarga real aún no está implementada — es UI de demostración)
  const handleExport = () => {
    setNotification({
      show: true,
      format: selectedFormat,           // "CSV" o "PDF"
      message: "Puedes visualizarlo en tus descargas."
    });
    setIsExportModalOpen(false); // Cierra el modal de exportar
  };

  // ─── Agregar nuevo contacto ──────────────────────────────────────────────────
  // Valida que todos los campos del formulario estén completos antes de proceder.
  // Crea un objeto contacto con un ID único basado en el timestamp actual.
  // Lo agrega al inicio de la lista y limpia el formulario.
  const handleAddContact = () => {
    // Si algún campo obligatorio está vacío, no hace nada
    if (!formData.name || !formData.email || !formData.phone || !formData.status) return;

    // Construir el nuevo objeto contacto con todos sus campos
    const newContact = {
      id: Date.now(),         // ID único basado en el timestamp actual (milisegundos)
      name: formData.name,    // Nombre ingresado en el formulario
      email: formData.email,  // Email ingresado
      phone: formData.phone,  // Teléfono ingresado
      status: formData.status,// Estado seleccionado ("Cliente" o "Prospecto")
      tags: ["Nuevo"],        // Tag por defecto para contactos recién creados
    };

    setContacts([newContact, ...contacts]); // Agregar al inicio de la lista (más reciente primero)
    setIsAddModalOpen(false);               // Cerrar el modal
    setFormData({ name: "", email: "", phone: "", status: "" }); // Limpiar el formulario

    // Mostrar notificación de éxito
    setNotification({
      show: true,
      format: "CONTACTO",
      message: "El contacto ha sido agregado exitosamente."
    });
  };

  // ─── Eliminar contacto ───────────────────────────────────────────────────────
  // Busca el contacto por ID para obtener su nombre (para el mensaje de confirmación).
  // Luego filtra la lista eliminando el contacto con ese ID.
  // Muestra una notificación de eliminación con el nombre del contacto.
  const handleDeleteContact = (id: number) => {
    const contactToDelete = contacts.find(c => c.id === id); // Buscar el contacto a eliminar
    setContacts(contacts.filter(c => c.id !== id));           // Crear nueva lista sin ese contacto
    setNotification({
      show: true,
      format: "ELIMINADO",
      message: `El contacto ${contactToDelete?.name} ha sido eliminado.` // Mensaje con el nombre
    });
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    // Contenedor principal con scroll vertical y fondo gris claro
    <div className="relative h-full overflow-y-auto p-6 lg:p-8 bg-[#FAFAFA] custom-scrollbar">

      {/* ── Toast Notification ──────────────────────────────────────────────────
          Se muestra en la esquina superior derecha cuando hay una acción completada.
          Solo aparece cuando notification.show === true. */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className={cn(
            "border rounded-xl p-4 shadow-lg min-w-[320px] relative flex items-start gap-3",
            // Fondo rojo si es eliminación, verde si es otro tipo de notificación
            notification.format === "ELIMINADO" ? "bg-rose-50 border-rose-100" : "bg-[#ECFDF5] border-[#A7F3D0]"
          )}>
            {/* Círculo de icono: rojo para eliminación, verde para acciones positivas */}
            <div className={cn(
              "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
              notification.format === "ELIMINADO" ? "bg-rose-100" : "bg-emerald-100"
            )}>
              {/* Icono de tacho si fue eliminado, tilde si fue otra acción */}
              {notification.format === "ELIMINADO" ? (
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
              )}
            </div>

            {/* Texto de la notificación */}
            <div className="flex flex-col flex-1">
              <h4 className="text-sm font-bold text-slate-800">
                {/* Título dinámico según el tipo de notificación */}
                {notification.format === "CONTACTO" && "Contacto agregado"}
                {notification.format === "ELIMINADO" && "Contacto eliminado"}
                {notification.format !== "CONTACTO" && notification.format !== "ELIMINADO" && `${notification.format} descargado correctamente`}
              </h4>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                {notification.message} {/* Mensaje secundario con detalle */}
              </p>
            </div>

            {/* Botón para cerrar la notificación manualmente antes de los 5s */}
            <button
              onClick={() => setNotification({ ...notification, show: false })}
              className="ml-2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Modal de Exportar ────────────────────────────────────────────────────
          Se muestra al hacer clic en "Exportar". Permite elegir CSV o PDF. */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 duration-200 relative p-8">

            {/* Botón cerrar modal exportar */}
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
              {/* Opción CSV: al hacer click selecciona CSV como formato */}
              <div
                onClick={() => setSelectedFormat("CSV")}
                className={cn(
                  "p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 group",
                  // Resaltar si está seleccionado
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

              {/* Opción PDF: al hacer click selecciona PDF como formato */}
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

            {/* Botón que ejecuta la exportación (llama a handleExport) */}
            <button
              onClick={handleExport}
              className="w-full py-4 bg-[#0D9488] text-white rounded-xl text-sm font-bold hover:bg-[#0f766c] shadow-lg shadow-[#0D9488]/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              Descargar
            </button>
          </div>
        </div>
      )}

      {/* ── Modal de Agregar Contacto ────────────────────────────────────────────
          Se muestra al hacer clic en "Agregar Contacto".
          Contiene un formulario con los campos del nuevo contacto. */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Agregar Nuevo Contacto</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">Agrega un nuevo contacto a tu lista.</p>
                </div>
                {/* Botón cerrar modal agregar contacto */}
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-10 h-8 rounded-lg bg-[#E11D48] text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Campo: Nombre — actualiza formData.name al escribir */}
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

                {/* Campo: Email — actualiza formData.email al escribir */}
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

                {/* Campo: Teléfono — actualiza formData.phone al escribir */}
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

                {/* Campo: Estado — dropdown con opciones "Cliente" / "Prospecto" */}
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
                    {/* Ícono de flecha personalizado sobre el select nativo */}
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Botón de submit: deshabilitado si algún campo está vacío */}
                <div className="pt-2">
                  <button
                    onClick={handleAddContact}
                    disabled={!formData.name || !formData.email || !formData.phone || !formData.status}
                    className={cn(
                      "w-full h-12 rounded-xl text-sm font-bold transition-all",
                      // Verde interactivo si todos los campos están llenos, gris deshabilitado si no
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

      {/* ── Header de la página ──────────────────────────────────────────────────
          Título "Contactos" + contador de contactos + botón de agregar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Contactos
          </h1>
          {/* Muestra el total de contactos en el subtítulo */}
          <p className="text-sm font-semibold text-slate-600 mt-1">
            Gestiona tus {contacts.length} contactos y prospectos
          </p>
        </div>

        {/* Botón que abre el modal para agregar un contacto nuevo */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-11 px-5 bg-[#0D9488] text-white rounded-lg shadow-sm flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#0f766c] transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Agregar Contacto
        </button>
      </div>

      {/* ── Barra de búsqueda y filtros ──────────────────────────────────────────
          Contiene el input de búsqueda y los botones de filtrar y exportar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Input de búsqueda — actualiza searchTerm que filtra la tabla en tiempo real */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" /> {/* Lupa decorativa */}
          </div>
          <input
            type="text"
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el filtro al escribir
            className="w-full h-11 pl-11 pr-4 bg-[#F1F5F9]/50 border-none rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Botón de filtro (UI solamente, funcionalidad pendiente) */}
          <div className="relative">
            <button className="h-11 px-4 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center gap-6 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                Todos
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Botón que abre el modal de exportar */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="h-11 px-6 bg-white border border-slate-200 rounded-lg shadow-sm flex items-center justify-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Exportar
          </button>
        </div>
      </div>

      {/* ── Tabla de contactos ───────────────────────────────────────────────────
          Itera sobre filteredContacts (ya filtrados por búsqueda) y dibuja una fila por contacto */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-50">
                {/* Checkbox de selección masiva: marca/desmarca todos los contactos visibles */}
                <th className="py-4 px-6 w-10">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={
                        // Marcado si todos los contactos filtrados están en selectedContacts
                        selectedContacts.length === filteredContacts.length && filteredContacts.length > 0
                      }
                      onChange={toggleSelectAll} // Llama a la función de selección masiva
                      className="w-4 h-4 rounded border-slate-200 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                    />
                  </div>
                </th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">Contacto</th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">Email</th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">Teléfono</th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">Estado</th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider">Etiquetas</th>
                <th className="py-4 px-4 text-[13px] font-bold text-slate-900 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* Renderizar una fila por cada contacto que pasó el filtro de búsqueda */}
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id} // React usa el ID como key para reconciliar el DOM eficientemente
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  {/* Columna: checkbox individual por contacto */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)} // Marcado si el ID está en el array
                        onChange={() => toggleSelectContact(contact.id)} // Alterna selección
                        className="w-4 h-4 rounded border-slate-200 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                      />
                    </div>
                  </td>

                  {/* Columna: avatar con iniciales + nombre + contador de mensajes */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar circular con las iniciales del contacto (máx 2 letras) */}
                      <div className="w-9 h-9 rounded-full bg-[#F8FAFC] border border-slate-100 flex items-center justify-center">
                        <span className="text-[13px] font-bold text-slate-900 uppercase">
                          {/* Toma la primera letra de cada palabra del nombre y une las dos primeras */}
                          {contact.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-tight">
                          {contact.name} {/* Nombre completo del contacto */}
                        </span>
                        {/* Contador de mensajes sin leer (estático por ahora) */}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-500">0 sin leer</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Columna: email del contacto */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-600">{contact.email}</span>
                    </div>
                  </td>

                  {/* Columna: teléfono del contacto */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-600">{contact.phone}</span>
                    </div>
                  </td>

                  {/* Columna: badge de estado (Cliente/Prospecto) + canal Whatsapp */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {/* Badge verde turquesa con el estado del contacto en el funnel */}
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-extrabold bg-[#0D9488] text-white shadow-sm shadow-[#0D9488]/10">
                        {contact.status}
                      </span>
                      {/* Badge de canal de comunicación (WhatsApp, estático) */}
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-extrabold bg-white border border-slate-100 text-slate-700 shadow-sm">
                        Whatsapp
                      </span>
                    </div>
                  </td>

                  {/* Columna: etiquetas del contacto (tags) */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {/* Recorre el array de tags y muestra un badge por cada uno */}
                      {contact.tags?.map((tag, idx) => (
                        <span
                          key={idx} // idx como key ya que los tags pueden repetirse
                          className="px-3 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-slate-600 whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Columna: menú de acciones (Ver, Mensaje, Editar, Eliminar) */}
                  <td className="py-4 px-6 text-right">
                    <DropdownMenu>
                      {/* Botón "..." que dispara el menú contextual */}
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer outline-none">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48 p-1">
                        {/* Opción: Ver perfil completo del contacto — navega a /contacts/:id */}
                        <DropdownMenuItem
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                          className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-slate-50"
                        >
                          <Eye className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-bold text-slate-700">Ver Detalles</span>
                        </DropdownMenuItem>

                        {/* Opción: Abrir la bandeja de chat filtrando por este contacto */}
                        <DropdownMenuItem
                          onClick={() => navigate(`/tray?id=${contact.id}`)}
                          className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-slate-50"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-bold text-slate-700">Enviar Mensaje</span>
                        </DropdownMenuItem>

                        {/* Opción: Editar (aún sin funcionalidad implementada) */}
                        <DropdownMenuItem className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-lg hover:bg-slate-50">
                          <Pencil className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-bold text-slate-700">Editar</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="my-1 bg-slate-50" />

                        {/* Opción: Eliminar contacto — llama a handleDeleteContact con el ID */}
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

          {/* Mensaje cuando no hay resultados que coincidan con la búsqueda */}
          {filteredContacts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-slate-500">No se encontraron contactos.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Botón flotante de ayuda ──────────────────────────────────────────────
          Botón circular fijo en la esquina inferior derecha (UI solamente) */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0D9488] rounded-full shadow-lg hover:shadow-xl hover:bg-[#0f766c] transition-all flex items-center justify-center z-50 cursor-pointer">
        <HelpCircle className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
