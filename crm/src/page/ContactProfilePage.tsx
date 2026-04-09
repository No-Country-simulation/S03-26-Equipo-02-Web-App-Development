import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Plus, 
  MessageSquare, 
  Tag, 
  Mail as MailIcon,
  Clock,
  ChevronRight,
  ChevronDown,
  Trash2,
  Calendar as CalendarIcon,
  HelpCircle,
  X,
  Search
} from "lucide-react";
import { useContacts } from "@/context/useContacts";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ContactProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, setContacts } = useContacts();
  const [activeTab, setActiveTab] = useState("Resumen");

  // State for Tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: "Hacer seguimiento con Sarah sobre agendamiento de demo", dueDate: "Vence hoy", priority: "Media", initials: "SJ", name: "Sarah Johnson" },
    { id: 2, title: "Preparar demo personalizada para el equipo de Sarah", dueDate: "Vence el 16/4/2026", priority: "Alta", initials: "SJ", name: "Sarah Johnson" }
  ]);
  const [taskForm, setTaskForm] = useState({ title: "", date: "", priority: "" });

  // State for Notes
  const [notes, setNotes] = useState([
    { id: 1, date: "3/4/2026", content: "Decisora clave en TechCorp. Interesada en plan enterprise. Hacer seguimiento sobre cronograma de implementación y necesidades de capacitación del equipo." }
  ]);
  const [noteContent, setNoteContent] = useState("");

  const contact = contacts.find((c) => c.id === Number(id));
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>([]);

  const availableTags = ["VIP", "Urgente", "Follow-up", "Nuevo", "Interesado", "Calificado"];

  if (!contact) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-slate-800">Contacto no encontrado</h2>
        <button 
          onClick={() => navigate("/contacts")}
          className="mt-4 text-[#0D9488] font-bold hover:underline"
        >
          Volver a Contactos
        </button>
      </div>
    );
  }

  const initials = contact.name.split(" ").map(n => n[0]).join("").substring(0, 2);

  const handleOpenTagsModal = () => {
    setTempSelectedTags(contact.tags || []);
    setIsTagsModalOpen(true);
  };

  const toggleTagSelection = (tag: string) => {
    setTempSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveTags = () => {
    setContacts(contacts.map(c => 
      c.id === contact.id ? { ...c, tags: tempSelectedTags } : c
    ));
    setIsTagsModalOpen(false);
  };

  const handleAddTask = () => {
    if (!taskForm.title || !taskForm.date || !taskForm.priority) return;
    const newTask = {
      id: Date.now(),
      title: taskForm.title,
      dueDate: `Vence el ${taskForm.date}`,
      priority: taskForm.priority,
      initials: initials,
      name: contact.name
    };
    setTasks([newTask, ...tasks]);
    setTaskForm({ title: "", date: "", priority: "" });
  };

  const handleAddNote = () => {
    if (!noteContent) return;
    const newNote = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      content: noteContent
    };
    setNotes([newNote, ...notes]);
    setNoteContent("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Baja": return "bg-[#0D9488]";
      case "Media": return "bg-[#F59E0B]";
      case "Alta": return "bg-[#E11D48]";
      default: return "bg-slate-400";
    }
  };

  return (
    <div className="relative h-full overflow-y-auto p-6 lg:p-10 bg-[#FAFAFA] animate-in fade-in duration-300 custom-scrollbar">
      {/* Manage Tags Modal */}
      {isTagsModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[450px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Gestionar Etiquetas</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-0.5">Selecciona las etiquetas que deseas agregar a {contact.name}</p>
                </div>
                <button onClick={() => setIsTagsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 relative">
                 <input 
                  type="text" 
                  placeholder="Buscar etiquetas..." 
                  className="w-full h-11 pl-4 pr-10 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#0D9488]/10"
                 />
                 <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide mb-8">
                {availableTags.map((tag) => (
                  <label 
                    key={tag} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
                  >
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => toggleTagSelection(tag)}
                        className="w-5 h-5 rounded border-slate-200 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                      />
                    </div>
                    <span className={cn(
                      "text-[13px] font-bold px-3 py-1 rounded-md transition-all",
                      tempSelectedTags.includes(tag) 
                        ? "bg-[#0D9488]/10 text-[#0D9488]" 
                        : "bg-slate-50 text-slate-600"
                    )}>
                      {tag}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsTagsModalOpen(false)}
                  className="flex-1 h-12 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveTags}
                  className="flex-1 h-12 bg-[#0D9488]/40 hover:bg-[#0D9488] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#0D9488]/10"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back button */}
      <button 
        onClick={() => navigate("/contacts")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-bold">Volver a Contactos</span>
      </button>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-2xl font-bold text-slate-900">
            {initials}
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{contact.name}</h1>
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex items-center gap-2 text-slate-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-semibold">{contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-semibold">{contact.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#0D9488] text-white rounded-lg text-[11px] font-extrabold shadow-sm shadow-[#0D9488]/10">
            {contact.status}
          </span>
          <span className="px-3 py-1 bg-white border border-slate-100 text-slate-700 rounded-lg text-[11px] font-extrabold shadow-sm shrink-0">
            Whatsapp
          </span>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex items-center gap-2 text-slate-400 mr-2">
          <Tag className="w-4 h-4" />
        </div>
        <div className="flex flex-wrap gap-2">
          {contact.tags?.map((tag, idx) => (
            <span 
              key={idx} 
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                availableTags.includes(tag) ? "bg-[#F1F5F9] text-slate-600 border border-slate-200" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {tag.toLowerCase()}
            </span>
          ))}
          <button 
            onClick={handleOpenTagsModal}
            className="w-8 h-8 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-xl w-fit mb-8 border border-slate-50 shadow-sm">
        {["Resumen", `Tareas (${tasks.length})`, "Notas"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.includes("Tareas") ? "Tareas" : tab)}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer",
              (activeTab === "Tareas" && tab.includes("Tareas")) || activeTab === tab
                ? "bg-[#0D9488] text-white shadow-md shadow-[#0D9488]/20" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl">
        {activeTab === "Resumen" && (
          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Activity Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-8">Resumen de Actividad</h3>
                
                <div className="space-y-0 divide-y divide-slate-50">
                  <div className="py-6 flex justify-between items-center group cursor-pointer hover:bg-slate-50/50 -mx-8 px-8 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-[#0D9488]">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Total de Mensajes</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5">Conversaciones intercambiadas</span>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">3</span>
                  </div>

                  <div className="py-6 flex justify-between items-center group cursor-pointer hover:bg-slate-50/50 -mx-8 px-8 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Etiquetas Activas</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5">Clasificaciones aplicadas</span>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900">2</span>
                  </div>

                  <div className="py-6 flex justify-between items-center group cursor-pointer hover:bg-slate-50/50 -mx-8 px-8 transition-colors border-b-none">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                        <MailIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">Canal Principal</span>
                        <span className="text-xs font-semibold text-slate-500 mt-0.5">Medio de comunicación preferido</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-md text-xs font-bold text-slate-700">Email</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Message Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-slate-900">Último Mensaje</h3>
                  <button 
                    onClick={() => navigate(`/tray?id=${contact.id}`)}
                    className="text-sm font-bold text-[#0D9488] hover:text-[#0f766c] flex items-center gap-1 group transition-colors cursor-pointer"
                  >
                    Ver Conversación Completa
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-50">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-sm font-bold text-slate-900 shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">{contact.name}</span>
                      <span className="text-[11px] font-semibold text-slate-400">10:23 AM</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      ¡Gracias por la rápida respuesta! Sí, una demo estaría genial. ¿Cuál es tu disponibilidad la próxima semana?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Tareas" && (
          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Create Task Form */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Crear Nueva Tarea</h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Título de la Tarea</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Hacer seguimiento del contacto..."
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/10 focus:ring-4 focus:ring-[#0D9488]/10 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-800">Fecha de Vencimiento</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={taskForm.date}
                        onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                        className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 outline-none hover:ring-4 hover:ring-[#0D9488]/10 focus:ring-4 focus:ring-[#0D9488]/10 transition-all appearance-none cursor-pointer"
                      />
                      <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-800">Prioridad</label>
                    <div className="relative">
                      <select 
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                        className="w-full h-12 px-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:ring-4 hover:ring-[#0D9488]/10 focus:ring-4 focus:ring-[#0D9488]/10 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Seleccionar Prioridad</option>
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleAddTask}
                  className="w-full h-12 bg-[#0D9488] text-white rounded-xl text-sm font-bold hover:bg-[#0f766c] shadow-lg shadow-[#0D9488]/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Agregar Tarea
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] p-6 transition-all hover:shadow-md group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <input type="checkbox" className="w-5 h-5 rounded-md border-slate-200 text-[#0D9488] focus:ring-[#0D9488] cursor-pointer" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-[#0D9488] transition-colors">{task.title}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className={cn(
                            "flex items-center gap-1.5 text-xs font-bold",
                            task.dueDate.includes("hoy") ? "text-rose-500" : "text-slate-500"
                          )}>
                            <Clock className="w-3.5 h-3.5" />
                            {task.dueDate}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-700">
                              {task.initials}
                            </div>
                            {task.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-md text-[11px] font-bold text-white",
                      getPriorityColor(task.priority)
                    )}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Notas" && (
          <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Add Note Form */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Agregar Nota</h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Descripción</label>
                  <textarea 
                    placeholder="Agregar una nota sobre este contacto..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full h-32 px-4 py-4 bg-[#F8FAFC] border border-slate-100 rounded-lg text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none hover:ring-4 hover:ring-[#0D9488]/10 focus:ring-4 focus:ring-[#0D9488]/10 transition-all resize-none"
                  />
                </div>
                <button 
                  onClick={handleAddNote}
                  className="w-full h-12 bg-[#0D9488] text-white rounded-xl text-sm font-bold hover:bg-[#0f766c] shadow-lg shadow-[#0D9488]/20 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Agregar Nota
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-6">
              {notes.map((note) => (
                <div key={note.id} className="relative group">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] p-8">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agregada el {note.date}</span>
                      <button 
                        onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {activeTab === "Resumen" && (
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#0D9488] rounded-full shadow-lg hover:shadow-xl hover:bg-[#0f766c] transition-all flex items-center justify-center z-50 cursor-pointer">
          <HelpCircle className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}

