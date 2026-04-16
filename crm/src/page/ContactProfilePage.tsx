import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Plus,
  Tag,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import ManageTagsModal from "@/components/modals/ManageTagsModal";
import CreateTaskForm from "@/components/ContactsDetail/CreateTaskForm";
import CardSummary from "@/components/ContactsDetail/CardSummary";
import CreateNotes from "@/components/ContactsDetail/CreateNotes";
import type { ApiContact } from "@/types/ApiContacts";

export default function ContactProfilePage() {
  const [activeTab, setActiveTab] = useState("Resumen");
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState<ApiContact | null>(null);

useEffect(() => {
  if (!id) return;

  fetch(`https://s03-26-equipo-02-web-app-development.onrender.com/contacts/${id}`)
    .then(res => res.json())
    .then(json => setContact(json.data));
}, [id]);

  const tasks =[
    { id: 1, title: "Hacer seguimiento con Sarah sobre agendamiento de demo", dueDate: "Vence hoy", priority: "Media", initials: "SJ", name: "Sarah Johnson" },
    { id: 2, title: "Preparar demo personalizada para el equipo de Sarah", dueDate: "Vence el 16/4/2026", priority: "Alta", initials: "SJ", name: "Sarah Johnson" }
    ];

  const availableTags = ["VIP", "Urgente", "Follow-up", "Nuevo", "Interesado", "Calificado"];

  if (!contact) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-slate-800">Contacto no encontrado</h2>
        <button onClick={() => navigate("/contacts")}>Volver a Contactos</button>
      </div>
    );
  }

  const initials = `${contact?.firstName ?? ""} ${contact?.lastName ?? ""}`.trim().split(" ").map(n => n[0]).join("").substring(0, 2);

  if (!contact) return <p>Cargando...</p>;


  return (
    <div className="relative h-full overflow-y-auto p-6 lg:p-10 bg-[#FAFAFA] animate-in fade-in duration-300 custom-scrollbar">
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{contact.firstName} {contact.lastName}</h1>
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
            Cliente
          </span>
          <span className="px-3 py-1 bg-white border border-slate-100 text-slate-700 rounded-lg text-[11px] font-extrabold shadow-sm shrink-0">
            {contact.phone === " " ? "Email" : "Whatsapp"}
          </span>
        </div>
      </div>

      {/* Tags Section */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex items-center gap-2 text-slate-400 mr-2">
          <Tag className="w-4 h-4" />
        </div>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag, idx) => (
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
            onClick={() => setIsTagsModalOpen(true)}
            className="w-8 h-8 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <ManageTagsModal isOpen={isTagsModalOpen}
          onClose={() => setIsTagsModalOpen(false)}
          contactName={contact.firstName}
          />
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

      <div className="max-w-5xl">
        {activeTab === "Resumen" && (
          <CardSummary contact={contact} />
        )}

        {activeTab === "Tareas" && (
          <CreateTaskForm />
        )}

        {activeTab === "Notas" && (
          <CreateNotes/>
        )}
      </div>
    </div>
  );
}

