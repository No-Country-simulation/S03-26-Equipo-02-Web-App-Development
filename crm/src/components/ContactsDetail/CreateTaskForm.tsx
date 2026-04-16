import {useState} from 'react'
import { CalendarIcon, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CreateTaskForm = () => {
    const [taskForm, setTaskForm] = useState({ title: "", date: "", priority: "" });

      const [tasks, setTasks] = useState([
    { id: 1, title: "Hacer seguimiento con Sarah sobre agendamiento de demo", dueDate: "Vence hoy", priority: "Media", initials: "SJ", name: "Sarah Johnson" },
    { id: 2, title: "Preparar demo personalizada para el equipo de Sarah", dueDate: "Vence el 16/4/2026", priority: "Alta", initials: "SJ", name: "Sarah Johnson" }
  ]);

      const handleAddTask = () => {
    if (!taskForm.title || !taskForm.date || !taskForm.priority) return;
    const newTask = {
      id: Date.now(),
      title: taskForm.title,
      dueDate: `Vence el ${taskForm.date}`,
      priority: taskForm.priority,
      initials: "MR",
      name: "mateo rodriguez"
    };
    setTasks([newTask, ...tasks]);
    setTaskForm({ title: "", date: "", priority: "" });
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
  )
}

export default CreateTaskForm
