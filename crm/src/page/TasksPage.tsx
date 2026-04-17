import {
  Plus,
  ListFilter,
  ChevronDown,
  Clock,
  Check,
  X,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getTasks, createTask, updateTask, deleteTask } from "../services/tasks";

// Fecth de contactos desde el backend en vez de hardcodeado
const fetchContacts = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || "https://s03-26-equipo-02-web-app-development.onrender.com";
    const res = await fetch(`${API_URL}/contacts`);
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const solidStyles: Record<string, string> = {
    Alta: "bg-[#E11D48] text-white", // Rose/Crimson
    Media: "bg-[#F59E0B] text-white", // Amber/Orange
    Baja: "bg-[#10B981] text-white", // Emerald/Green
  };

  return (
    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold leading-none min-w-[70px] text-center ${solidStyles[priority] || solidStyles.Baja}`}>
      {priority}
    </span>
  );
};

const TaskItem = ({ task, onToggle, onDelete }: { task: any, onToggle: (id: string, currentStatus: boolean) => void, onDelete: (id: string) => void }) => {
  return (
    <div className={`p-5 bg-white border border-slate-100 rounded-2xl flex items-center gap-5 transition-all hover:shadow-md hover:border-slate-200 ${task.completed ? 'opacity-80' : ''}`}>
      <div className="flex-shrink-0 cursor-pointer" onClick={() => onToggle(task.id, task.completed)}>
        {task.completed ? (
          <div className="w-6 h-6 bg-[#0D9488] rounded-md flex items-center justify-center shadow-sm">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 border-2 border-slate-200 rounded-md hover:border-[#0D9488] transition-colors bg-white shadow-sm" />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <h4 className={`text-[15px] font-bold text-slate-900 leading-tight ${task.completed ? 'text-slate-400 line-through' : ''}`}>
          {task.title}
        </h4>
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-1.5 text-[12px] font-bold ${task.completed ? 'text-slate-400' : (task.dueDate.includes('hoy') ? 'text-[#B45309]' : 'text-slate-500')}`}>
            <Clock size={15} />
            <span>{task.dueDate.startsWith('20') ? new Date(task.dueDate).toLocaleDateString() : task.dueDate}</span>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] uppercase ${task.completed ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
              {task.user.initials}
            </div>
            <span>{task.user.name}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        {task.completed ? (
          <span className="px-4 py-1.5 rounded-lg text-xs font-bold leading-none min-w-[70px] text-center bg-slate-100 text-slate-400 border border-slate-200">
            {task.priority}
          </span>
        ) : (
          <PriorityBadge priority={task.priority} />
        )}
      </div>
      <button 
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
        title="Eliminar tarea"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const AddTaskModal = ({ isOpen, onClose, onRefresh, dbContacts }: { isOpen: boolean; onClose: () => void; onRefresh: () => void; dbContacts: any[] }) => {
  const [title, setTitle] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priority || !selectedContact || !dueDate) return;

    setLoading(true);
    try {
      const priorityMap: Record<string, "high" | "medium" | "low"> = {
        "Alta": "high",
        "Media": "medium",
        "Baja": "low"
      };

      const contactObj = dbContacts.find(c => c.id === selectedContact);
      if (!contactObj) {
        setLoading(false);
        return;
      }

      await createTask({
        contactId: contactObj.id,
        title,
        priority: priorityMap[priority],
        expirationDate: new Date(dueDate).toISOString()
      });
      
      onRefresh();

      // Reset form
      setTitle("");
      setSelectedContact("");
      setDueDate("");
      setPriority("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = title && priority && selectedContact && dueDate && !loading;

  return (
    <div className="fixed inset-0 z-[40] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[850px] rounded-[40px] p-14 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
        <div className="flex justify-between items-start mb-12">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Crear Nueva Tarea</h2>
            <p className="text-base font-bold text-slate-400">Agrega una nueva tarea a tu lista.</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg shadow-rose-500/20 group cursor-pointer"
          >
            <X size={20} className="text-white" strokeWidth={3} />
          </button>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-black text-slate-800 ml-1">Título de la Tarea</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Hacer seguimiento con..."
              className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold text-slate-700 placeholder:text-slate-300 focus-visible:ring-[#0D9488]/10 focus-visible:border-[#0D9488]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-black text-slate-800 ml-1">Contacto Relacionado</label>
            <Select value={selectedContact} onValueChange={(val) => setSelectedContact(val ?? "")}>
              <SelectTrigger className="w-full h-16 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold text-slate-700 focus:ring-[#0D9488]/10 focus:border-[#0D9488]">
                <SelectValue placeholder="Seleccionar Contacto" />
              </SelectTrigger>
              <SelectContent sideOffset={0} className="rounded-2xl border-slate-100 p-2 shadow-xl z-50 max-h-[300px] overflow-y-auto">
                {dbContacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-black text-slate-800 ml-1">Fecha de Vencimiento</label>
            <div className="relative">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-16 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold text-slate-700 focus-visible:ring-[#0D9488]/10 focus-visible:border-[#0D9488]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-black text-slate-800 ml-1">Prioridad</label>
            <Select value={priority} onValueChange={(val) => setPriority(val ?? "")}>
              <SelectTrigger className="w-full h-16 rounded-2xl border-slate-100 bg-slate-50/50 px-6 font-bold text-slate-700 focus:ring-[#0D9488]/10 focus:border-[#0D9488]">
                <SelectValue placeholder="Seleccionar Prioridad" />
              </SelectTrigger>
              <SelectContent sideOffset={0} className="rounded-2xl border-slate-100 p-2 shadow-xl z-50">
                <SelectItem value="Alta">Prioridad Alta</SelectItem>
                <SelectItem value="Media">Prioridad Media</SelectItem>
                <SelectItem value="Baja">Prioridad Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={cn(
              "mt-4 h-14 px-10 self-end font-black rounded-2xl transition-all shadow-lg text-sm uppercase tracking-widest",
              isFormValid
                ? "bg-[#0D9488] text-white hover:bg-[#0A7A6F] shadow-[#0D9488]/20 cursor-pointer"
                : "bg-slate-50 text-slate-300 cursor-not-allowed"
            )}
          >
            {loading ? "Creando..." : "Crear Tarea"}
          </button>
        </form>
      </div>
    </div>
  );
};

const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [dbContacts, setDbContacts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todas las Tareas");
  const [priorityFilter, setPriorityFilter] = useState("Todas las Prioridades");

  useEffect(() => {
    fetchContacts().then(contacts => {
      // Formatear para uso en modal y nombres
      const formatted = contacts.map((c: any) => ({
        id: c.id,
        name: c.firstName ? `${c.firstName} ${c.lastName || ''}`.trim() : 'Desconocido'
      }));
      setDbContacts(formatted);
    });
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      const tasksData = Array.isArray(response) ? response : (response.data || []);
      
      const formatted = tasksData.map((t: any) => {
        const contactId = t.contact?.id || t.contactId;
        const fallbackName = t.contact?.firstName ? `${t.contact.firstName} ${t.contact.lastName || ''}`.trim() : 'Desconocido';
        const contactFromDb = dbContacts.find(c => c.id === contactId);
        const contactName = contactFromDb ? contactFromDb.name : fallbackName;
        
        const priorityMap: Record<string, string> = {
          high: "Alta",
          medium: "Media",
          low: "Baja"
        };
        const dateObj = t.expirationDate ? new Date(t.expirationDate) : null;
        let formattedDate = "Sin fecha";
        if (dateObj && !isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toLocaleDateString();
        }

        return {
          id: t.id,
          title: t.title,
          dueDate: formattedDate,
          user: {
            name: contactName,
            initials: contactName !== 'Desconocido' ? contactName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : "U"
          },
          priority: priorityMap[t.priority] || "Media",
          completed: t.complete === true || t.completed === true || t.status === "completed"
        };
      });
      setTasks(formatted);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // Al cargar componentes, e idealmente despues de cargar contactos, cargamos las tareas
    fetchTasks();
  }, [dbContacts]);

  useEffect(() => {
    const pendingCount = tasks.filter(t => !t.completed).length;
    window.dispatchEvent(new CustomEvent("tasksUpdated", { detail: pendingCount }));
  }, [tasks]);

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));
      await updateTask(taskId, { complete: !currentStatus });
    } catch (e) {
      console.error(e);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      await deleteTask(taskId);
    } catch (e) {
      console.error(e);
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (statusFilter === "Pendientes" && task.completed) return false;
    if (statusFilter === "Completadas" && !task.completed) return false;

    if (priorityFilter !== "Todas las Prioridades") {
      const p = priorityFilter.replace("Prioridad ", "");
      if (task.priority !== p) return false;
    }

    return true;
  });

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className="p-10 bg-[#FBFDFF] min-h-screen flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Tareas</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-600">{tasks.filter(t => !t.completed).length} pendientes</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-sm font-bold text-slate-600">{tasks.filter(t => t.completed).length} completadas</span>
          </div>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0D9488] hover:bg-[#0A7A6F] text-white font-black px-10 py-5 rounded-xl flex items-center gap-3 shadow-lg shadow-[#0D9488]/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={22} strokeWidth={3} />
          Nueva Tarea
        </Button>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchTasks} dbContacts={dbContacts} />

      <div className="flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-5 py-3 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-all min-w-[200px] justify-between">
              <div className="flex items-center gap-4">
                <ListFilter size={20} className="text-slate-500" />
                <span className="text-[15px] font-bold text-slate-700">{statusFilter}</span>
              </div>
              <ChevronDown size={20} className="text-slate-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] p-2 bg-white rounded-2xl shadow-xl border-slate-100">
            {["Todas las Tareas", "Pendientes", "Completadas"].map((label) => (
              <DropdownMenuItem
                key={label}
                onClick={() => setStatusFilter(label)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-[15px] my-1",
                  statusFilter === label
                    ? "bg-[#0D9488] text-white hover:bg-[#0D9488] hover:text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0D9488]"
                )}
              >
                {label}
                {statusFilter === label && <Check size={18} />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-5 py-3 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-all min-w-[220px] justify-between">
              <span className="text-[15px] font-bold text-slate-700">{priorityFilter}</span>
              <ChevronDown size={20} className="text-slate-400" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px] p-2 bg-white rounded-2xl shadow-xl border-slate-100">
            {["Todas las Prioridades", "Prioridad Alta", "Prioridad Media", "Prioridad Baja"].map((label) => (
              <DropdownMenuItem
                key={label}
                onClick={() => setPriorityFilter(label)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-[15px] my-1",
                  priorityFilter === label
                    ? "bg-[#0D9488] text-white hover:bg-[#0D9488] hover:text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#0D9488]"
                )}
              >
                {label}
                {priorityFilter === label && <Check size={18} />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(statusFilter === "Todas las Tareas" || statusFilter === "Pendientes") && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-black text-[#0F172A]">Tareas Pendientes</h2>
          <div className="flex flex-col gap-4">
            {pendingTasks.length > 0 ? (
              pendingTasks.map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleComplete} onDelete={handleDeleteTask} />)
            ) : (
              <p className="text-slate-400 text-sm font-bold py-4">No hay tareas pendientes que coincidan con los filtros.</p>
            )}
          </div>
        </div>
      )}

      {(statusFilter === "Todas las Tareas" || statusFilter === "Completadas") && (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-black text-[#0F172A]">Tareas Completadas</h2>
          <div className="flex flex-col gap-4">
            {completedTasks.length > 0 ? (
              completedTasks.map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleComplete} onDelete={handleDeleteTask} />)
            ) : (
              <p className="text-slate-400 text-sm font-bold py-4">No hay tareas completadas que coincidan con los filtros.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;

