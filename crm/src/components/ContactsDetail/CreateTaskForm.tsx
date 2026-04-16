import { useState, useEffect } from 'react';
import { CalendarIcon, ChevronDown, Clock, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTasks, createTask, updateTask, deleteTask } from "../../services/tasks";

interface CreateTaskFormProps {
  contactId: string;
  contactName: string;
  onTaskCountChange?: (count: number) => void;
}

const CreateTaskForm = ({ contactId, contactName, onTaskCountChange }: CreateTaskFormProps) => {
  const [taskForm, setTaskForm] = useState({ title: "", date: "", priority: "" });
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      const tasksData = Array.isArray(response) ? response : (response.data || []);
      
      const filteredTasks = tasksData.filter((t: any) => {
        const tContactId = t.contact?.id || t.contactId;
        return tContactId === contactId;
      });

      const formatted = filteredTasks.map((t: any) => {
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
          priority: priorityMap[t.priority] || "Media",
          completed: t.complete === true || t.completed === true || t.status === "completed",
          initials: contactName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || "U",
          name: contactName
        };
      });
      setTasks(formatted);
      if (onTaskCountChange) {
        const pending = formatted.filter((t: any) => !t.completed).length;
        onTaskCountChange(pending);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (contactId) {
      fetchTasks();
    }
  }, [contactId]);

  const handleAddTask = async () => {
    if (!taskForm.title || !taskForm.date || !taskForm.priority || loading) return;
    setLoading(true);
    try {
      const priorityMap: Record<string, "high" | "medium" | "low"> = {
        "Alta": "high",
        "Media": "medium",
        "Baja": "low"
      };

      await createTask({
        contactId,
        title: taskForm.title,
        priority: priorityMap[taskForm.priority],
        expirationDate: new Date(taskForm.date).toISOString()
      });

      await fetchTasks();
      setTaskForm({ title: "", date: "", priority: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !currentStatus } : t));
      await updateTask(taskId, { complete: !currentStatus });
    } catch (e) {
      console.error(e);
      fetchTasks(); // revert on error
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      await deleteTask(taskId);
    } catch (e) {
      console.error(e);
      fetchTasks(); // revert on error
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Baja": return "bg-[#10B981]"; 
      case "Media": return "bg-[#F59E0B]";
      case "Alta": return "bg-[#E11D48]";
      default: return "bg-slate-400";
    }
  };

  return (
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
            disabled={loading || !taskForm.title || !taskForm.date || !taskForm.priority}
            className="w-full h-12 bg-[#0D9488] text-white rounded-xl text-sm font-bold hover:bg-[#0f766c] shadow-lg shadow-[#0D9488]/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Agregando..." : "Agregar Tarea"}
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length > 0 ? tasks.map((task) => (
          <div key={task.id} className={cn("bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] p-6 transition-all hover:shadow-md group", task.completed ? "opacity-70" : "")}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div 
                  className="mt-1 cursor-pointer flex-shrink-0"
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                >
                  {task.completed ? (
                    <div className="w-5 h-5 bg-[#0D9488] rounded-md flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-slate-200 rounded-md hover:border-[#0D9488] transition-colors bg-white" />
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <h4 className={cn("text-[15px] font-bold transition-colors group-hover:text-[#0D9488]", task.completed ? "text-slate-400 line-through" : "text-slate-900")}>{task.title}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className={cn(
                      "flex items-center gap-1.5 text-xs font-bold",
                      task.completed ? "text-slate-400" : (task.dueDate.includes("hoy") ? "text-[#B45309]" : "text-slate-500")
                    )}>
                      <Clock className="w-3.5 h-3.5" />
                      {task.dueDate}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px]", task.completed ? "bg-slate-100 text-slate-400" : "bg-slate-100 text-slate-700")}>
                        {task.initials}
                      </div>
                      <span className={task.completed ? "text-slate-400" : ""}>{task.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "px-3 py-1 rounded-md text-[11px] font-bold text-center min-w-[60px]",
                  task.completed ? "bg-slate-100 text-slate-400 border border-slate-200" : `text-white ${getPriorityColor(task.priority)}`
                )}>
                  {task.priority}
                </span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Eliminar tarea"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <p className="text-slate-400 text-sm font-bold text-center py-6">No hay tareas asociadas a este contacto.</p>
        )}
      </div>
    </div>
  );
};

export default CreateTaskForm;
