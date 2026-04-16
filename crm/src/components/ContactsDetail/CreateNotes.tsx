import { useState } from "react";
import { Trash2 } from "lucide-react";

const CreateNotes = () => {
    const [notes, setNotes] = useState([
    { id: 1, date: "3/4/2026", content: "Decisora clave en TechCorp. Interesada en plan enterprise. Hacer seguimiento sobre cronograma de implementación y necesidades de capacitación del equipo." }
  ]);
  const [noteContent, setNoteContent] = useState("");
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
  return (
    <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Add Note Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Agregar Nota</h3>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">
              Descripción
            </label>
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Agregada el {note.date}
                </span>
                <button
                  onClick={() =>
                    setNotes(notes.filter((n) => n.id !== note.id))
                  }
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
  );
};

export default CreateNotes;
