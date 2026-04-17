import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Contact } from '@/context/ContactsContext';
import { useContacts } from '@/context/useContacts';
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  User,
  Trash2,
  X,
  MessageCircle,
  Tag,
  ArrowLeft,
  Clock,
  ChevronDown,
} from 'lucide-react';

// Contacts state is now managed globally via ContactsContext

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Cliente':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0D9488] text-white border-[#0D9488] shadow-sm">
          cliente
        </span>
      );
    case 'Prospecto':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FFFFFF] border border-gray-200 shadow-sm text-gray-700">
          Prospecto
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">
          {status}
        </span>
      );
  }
};

const seededValue = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getContactMetrics = (contact: Contact) => {
  const seed = contact.id * 37 + contact.name.length;
  const messages = Math.max(2, Math.round(seededValue(seed + 1) * 8) + 1);
  const tags = contact.tags.length || Math.max(1, Math.round(seededValue(seed + 2) * 3));
  const channels = ['Email', 'Whatsapp', 'Teléfono'];
  const channel = channels[Math.floor(seededValue(seed + 3) * channels.length)];
  const tasks = Math.max(1, Math.round(seededValue(seed + 4) * 4));
  const times = ['10:23 AM', '9:12 AM', '11:08 AM', '4:20 PM'];
  const time = times[Math.floor(seededValue(seed + 5) * times.length)];
  const previews = [
    `Hola ${contact.name.split(' ')[0]}, gracias por tu mensaje. Ya lo reviso y te comento.`,
    `¡Gracias! Confirmo que tu solicitud está en proceso.`,
    `Recibí tu consulta y en breve te envío todos los detalles.`,
    `Perfecto, estamos listos para avanzar con el siguiente paso.`,
  ];
  const preview = previews[Math.floor(seededValue(seed + 6) * previews.length)];
  return { messages, tags, channel, tasks, time, preview };
};

const Contacts = () => {
  const { contacts, setContacts } = useContacts();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<'Resumen' | 'Tareas' | 'Notas'>('Resumen');
  const [currentChannel, setCurrentChannel] = useState<string>('');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tagOptions = ['Empresa', 'Startup', 'Alta Prioridad', 'Demo Solicitado', 'Agencia', 'Prospecto Cálido', 'Onboarding', 'Evaluación'];
  const channels = ['Email', 'Whatsapp', 'Teléfono'];

  const cycleChannel = () => {
    const currentIndex = channels.indexOf(currentChannel);
    const nextIndex = (currentIndex + 1) % channels.length;
    setCurrentChannel(channels[nextIndex]);
  };

  const openTagModal = () => {
    if (!viewingContact) return;
    setSelectedTags(viewingContact.tags || []);
    setTagSearch('');
    setIsTagModalOpen(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((existing) => existing !== tag) : [...prev, tag]
    );
  };

  const applyTagsToContact = () => {
    if (!viewingContact) return;
    const updatedContact = { ...viewingContact, tags: selectedTags };
    setViewingContact(updatedContact);
    setContacts((prev) => prev.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)));
    setIsTagModalOpen(false);
  };

  type TaskItem = {
    id: number;
    title: string;
    dueLabel: string;
    dueState: 'today' | 'later';
    owner: string;
    initials: string;
    priority: 'Alta' | 'Media' | 'Baja';
    contactId: number;
  };

  type NoteItem = {
    id: number;
    text: string;
    date: string;
    contactId: number;
  };

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    if (typeof window === 'undefined') {
      return [
        {
          id: 1,
          title: 'Hacer seguimiento con Sarah sobre agendamiento de demo',
          dueLabel: 'Vence hoy',
          dueState: 'today',
          owner: 'Sarah Johnson',
          initials: 'SJ',
          priority: 'Media',
          contactId: 1,
        },
        {
          id: 2,
          title: 'Preparar demo personalizada para el equipo de Sarah',
          dueLabel: 'Vence el 16/4/2026',
          dueState: 'later',
          owner: 'Sarah Johnson',
          initials: 'SJ',
          priority: 'Alta',
          contactId: 1,
        },
      ];
    }
    const stored = window.localStorage.getItem('crm_tasks');
    return stored ? (JSON.parse(stored) as TaskItem[]) : [
      {
        id: 1,
        title: 'Hacer seguimiento con Sarah sobre agendamiento de demo',
        dueLabel: 'Vence hoy',
        dueState: 'today',
        owner: 'Sarah Johnson',
        initials: 'SJ',
        priority: 'Media',
        contactId: 1,
      },
      {
        id: 2,
        title: 'Preparar demo personalizada para el equipo de Sarah',
        dueLabel: 'Vence el 16/4/2026',
        dueState: 'later',
        owner: 'Sarah Johnson',
        initials: 'SJ',
        priority: 'Alta',
        contactId: 1,
      },
    ];
  });
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    if (typeof window === 'undefined') {
      return [
        {
          id: 1,
          text: 'Decisora clave en TechCorp. Interesada en plan enterprise. Hacer seguimiento sobre cronograma de implementación y necesidades de capacitación del equipo.',
          date: '3/4/2026',
          contactId: 1,
        },
      ];
    }
    const stored = window.localStorage.getItem('crm_notes');
    return stored ? (JSON.parse(stored) as NoteItem[]) : [
      {
        id: 1,
        text: 'Decisora clave en TechCorp. Interesada en plan enterprise. Hacer seguimiento sobre cronograma de implementación y necesidades de capacitación del equipo.',
        date: '3/4/2026',
        contactId: 1,
      },
    ];
  });

  const addTask = () => {
    if (!taskTitle.trim()) return;

    let formattedDate = taskDueDate;
    if (taskDueDate) {
      const parts = taskDueDate.split('-');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    }

    const newTask: TaskItem = {
      id: Date.now(),
      title: taskTitle,
      dueLabel: formattedDate ? `Vence el ${formattedDate}` : 'Vence hoy',
      dueState: taskDueDate ? 'later' : 'today',
      owner: viewingContact?.name ?? 'Sarah Johnson',
      initials: (viewingContact?.name ?? 'Sarah Johnson')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .substring(0, 2),
      priority: taskPriority,
      contactId: viewingContact?.id ?? 1,
    };
    setTasks((prev) => [newTask, ...prev]);
    setTaskTitle('');
    setTaskDueDate('');
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const newNote: NoteItem = {
      id: Date.now(),
      text: noteText,
      date: new Date().toLocaleDateString('es-AR'),
      contactId: viewingContact?.id ?? 1,
    };
    setNotes((prev) => [newNote, ...prev]);
    setNoteText('');
  };

  const deleteNote = (noteId: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const filteredTasks = tasks.filter((task) => task.contactId === (viewingContact?.id ?? 1));
  const filteredNotes = notes.filter((note) => note.contactId === (viewingContact?.id ?? 1));

  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Prospecto',
    tags: [] as string[]
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (viewingContact) {
      const metrics = getContactMetrics(viewingContact);
      setCurrentChannel(metrics.channel);
      setActiveTab('Resumen');
    }
  }, [viewingContact]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('crm_notes', JSON.stringify(notes));
  }, [notes]);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const toggleSelectContact = (id: number) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleDeleteContact = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este contacto?')) {
      setContacts(prev => prev.filter(c => c.id !== id));
      setOpenDropdownId(null);
      if (viewingContact?.id === id) setViewingContact(null);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    const contactToAdd = {
      ...newContact,
      id: Date.now(),
      tags: newContact.tags.length > 0 ? newContact.tags : ['General']
    };
    setContacts([contactToAdd, ...contacts]);
    setIsModalOpen(false);
    setNewContact({ name: '', email: '', phone: '', status: 'Prospecto', tags: [] });
  };

  return (
    <div className="flex-1 px-12 py-8 w-full relative">
      {isTagModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300" style={{ backgroundColor: '#0F172A52', backdropFilter: 'blur(8px)' }}>
          <div className="bg-white rounded-[30px] w-full max-w-xl shadow-2xl p-6 animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-gray-200 relative overflow-hidden">
            <button
              onClick={() => setIsTagModalOpen(false)}
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-white text-slate-400 shadow-sm border border-gray-200 hover:bg-rose-600 hover:text-white transition-all"
            >
              <X size={20} strokeWidth={3} />
            </button>
            <div className="mb-6 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-950">Gestionar Etiquetas</h3>
                  <p className="mt-1 text-sm text-slate-500">Selecciona las etiquetas que deseas agregar a {viewingContact?.name}</p>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  value={tagSearch}
                  onChange={(e) => setTagSearch(e.target.value)}
                  placeholder="Buscar etiquetas..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-12 py-3 text-sm text-slate-700 outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10"
                />
              </div>
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
                {tagOptions
                  .filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()))
                  .map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${active ? 'border-[#0D9488] bg-[#ECFDF5] text-slate-950' : 'border-gray-200 bg-white text-slate-700 hover:border-[#0D9488] hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={active}
                            readOnly
                            className="h-4 w-4 rounded border-gray-300 text-[#0D9488] focus:ring-[#0D9488]"
                          />
                          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-slate-50 px-3 py-1 text-sm text-slate-700">
                            <Tag size={14} className="text-[#0D9488]" />
                            {tag}
                          </span>
                        </div>
                      </button>
                    );
                  })}
              </div>
              <button
                onClick={applyTagsToContact}
                className="w-full rounded-2xl bg-[#0D9488] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={selectedTags.length === 0}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
      {viewingContact ? (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col h-full">
          {(() => {
            const metrics = getContactMetrics(viewingContact);
            if (!currentChannel) setCurrentChannel(metrics.channel);
            return (
              <>
                <div className="mb-6">
                  <button
                    onClick={() => setViewingContact(null)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#0D9488] transition"
                  >
                    <ArrowLeft size={18} />
                    Volver a Contactos
                  </button>
                </div>
                <div className="space-y-5 mb-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-white shadow-lg flex items-center justify-center text-xl font-black text-[#0D9488]">
                        {viewingContact.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .substring(0, 2)}
                      </div>
                      <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-950">{viewingContact.name}</h1>
                        <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:gap-6">
                          <span className="inline-flex items-center gap-2">
                            <Mail size={16} className="text-slate-400" />
                            {viewingContact.email}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Phone size={16} className="text-slate-400" />
                            {viewingContact.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-full bg-[#0D9488] text-white text-xs font-semibold uppercase tracking-[0.15em] shadow-sm">
                        {viewingContact.status}
                      </span>
                      <button className="px-4 py-2 rounded-full bg-[#ECFDF5] text-[#0D9488] text-xs font-semibold shadow-sm hover:bg-[#D1FAE5] transition">
                        Whatsapp
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {viewingContact.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-slate-700 shadow-sm">
                        <Tag size={16} className="text-[#0D9488]" />
                        {tag}
                      </span>
                    ))}
                    <button
                      onClick={openTagModal}
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                    >
                      <Plus size={16} />
                      Etiquetas
                    </button>
                  </div>

                  <div className="inline-flex rounded-[18px] bg-white border border-gray-200 shadow-sm p-1">
                    <button
                      onClick={() => setActiveTab('Resumen')}
                      className={`px-4 py-2 rounded-[16px] text-sm font-semibold transition ${activeTab === 'Resumen' ? 'bg-[#0D9488] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      Resumen
                    </button>
                    <button
                      onClick={() => setActiveTab('Tareas')}
                      className={`px-4 py-2 rounded-[16px] text-sm font-semibold transition ${activeTab === 'Tareas' ? 'bg-[#0D9488] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      Tareas ({metrics.tasks})
                    </button>
                    <button
                      onClick={() => setActiveTab('Notas')}
                      className={`px-4 py-2 rounded-[16px] text-sm font-semibold transition ${activeTab === 'Notas' ? 'bg-[#0D9488] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      Notas
                    </button>
                  </div>
                </div>

                {activeTab === 'Resumen' && (
                  <>
                    <div className="bg-white rounded-[28px] border border-gray-200 shadow-xl shadow-gray-200/10 p-6">
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-400">Resumen de Actividad</p>
                          </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                          <div className="flex items-center justify-between py-4 gap-4">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#ECFDF5] text-emerald-700">
                                <MessageCircle size={16} />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-950">Total de Mensajes</p>
                                <p className="text-xs text-slate-500">Conversaciones intercambiadas</p>
                              </div>
                            </div>
                            <p className="text-xl font-black text-slate-950">{metrics.messages}</p>
                          </div>
                          <div className="flex items-center justify-between py-4 gap-4">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#2563EB]">
                                <Tag size={16} />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-950">Etiquetas Activas</p>
                                <p className="text-xs text-slate-500">Clasificaciones aplicadas</p>
                              </div>
                            </div>
                            <p className="text-xl font-black text-slate-950">{metrics.tags}</p>
                          </div>
                          <div className="flex items-center justify-between py-4 gap-4">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#F8FAFC] text-[#0D9488]">
                                <Mail size={16} />
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-slate-950">Canal Principal</p>
                                <p className="text-xs text-slate-500">Medio de comunicación preferido</p>
                              </div>
                            </div>
                            <button
                              onClick={cycleChannel}
                              className="px-3 py-2 rounded-full bg-white border border-gray-200 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition cursor-pointer"
                            >
                              {currentChannel}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[28px] border border-gray-200 shadow-xl shadow-gray-200/10 p-5 mt-5">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <h3 className="text-sm font-black text-slate-950">Último Mensaje</h3>
                        <button
                          onClick={() => navigate('/tray')}
                          className="text-xs font-bold text-[#0D9488] hover:text-[#0F766E] transition"
                        >
                          Ver Conversación Completa
                        </button>
                      </div>
                      <div className="flex flex-col gap-4 p-4 rounded-[24px] bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-sm font-black text-[#0D9488] border border-gray-200">
                            {viewingContact.name
                              .split(' ')
                              .map((part) => part[0])
                              .join('')
                              .substring(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm">
                              <p className="font-semibold text-slate-950">{viewingContact.name}</p>
                              <span className="text-xs text-slate-400">{metrics.time}</span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600 leading-6">{metrics.preview}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'Tareas' && (
                  <>
                    <div className="bg-white rounded-[28px] border border-gray-200 shadow-xl shadow-gray-200/10 p-6">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-lg font-black text-slate-950">Crear Nueva Tarea</h2>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900">Título de la Tarea</label>
                            <input
                              type="text"
                              value={taskTitle}
                              onChange={(e) => setTaskTitle(e.target.value)}
                              placeholder="Ej. Hacer seguimiento del contacto..."
                              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-slate-700 outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900">Fecha de Vencimiento</label>
                            <input
                              type="date"
                              value={taskDueDate}
                              onChange={(e) => setTaskDueDate(e.target.value)}
                              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-slate-700 outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-900">Prioridad</label>
                            <div className="relative">
                              <select
                                value={taskPriority}
                                onChange={(e) => setTaskPriority(e.target.value as 'Alta' | 'Media' | 'Baja')}
                                className="w-full px-4 py-3 pr-10 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-slate-700 outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 appearance-none cursor-pointer"
                              >
                                <option value="Alta">Alta</option>
                                <option value="Media">Media</option>
                                <option value="Baja">Baja</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
                                <ChevronDown size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={addTask}
                          className="w-full rounded-2xl bg-[#0D9488] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F766E]"
                        >
                          Agregar Tarea
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 mt-5">
                      {filteredTasks.map((task) => (
                        <div key={task.id} className="rounded-[24px] border border-gray-200 bg-white p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0D9488] focus:ring-[#0D9488]" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-950">{task.title}</p>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                  <span className={`inline-flex items-center gap-1 ${task.dueState === 'today' ? 'text-rose-600' : 'text-amber-600'}`}>
                                    <Clock size={14} />
                                    {task.dueLabel}
                                  </span>
                                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                    {task.initials}
                                  </span>
                                  <span className="text-xs text-slate-500">{task.owner}</span>
                                </div>
                              </div>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${task.priority === 'Alta' ? 'bg-[#E11D48] text-white' : task.priority === 'Media' ? 'bg-[#F59E0B] text-white' : 'bg-[#059669] text-white'}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === 'Notas' && (
                  <>
                    <div className="bg-white rounded-[28px] border border-gray-200 shadow-xl shadow-gray-200/10 p-6">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-lg font-black text-slate-950">Agregar Nota</h2>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-900">Descripción</label>
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Agregar una nota sobre este contacto..."
                            className="mt-2 w-full h-32 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/10 resize-none"
                          />
                        </div>
                        <button
                          onClick={addNote}
                          className="w-full rounded-2xl bg-[#0D9488] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0F766E]"
                        >
                          Agregar Nota
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 mt-5">
                      {filteredNotes.length === 0 ? (
                        <div className="rounded-[24px] border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-slate-500">
                          No hay notas guardadas para este contacto.
                        </div>
                      ) : (
                        filteredNotes.map((note) => (
                          <div key={note.id} className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Agregada el {note.date}</p>
                              </div>
                              <button
                                onClick={() => deleteNote(note.id)}
                                type="button"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white transition hover:bg-rose-700"
                                aria-label="Eliminar nota"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-slate-700">{note.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </div>
      ) : (
        <>
          {/* New Contact Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300" style={{ backgroundColor: '#0F172A52', backdropFilter: 'blur(8px)' }}>
              <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl p-10 animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-white relative overflow-hidden">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-[#E11D48] hover:text-white transition-all active:scale-95 z-10 shadow-sm border border-gray-100"
                >
                  <X size={24} strokeWidth={3} />
                </button>
                <header className="flex justify-between items-start mb-8">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-black text-[#0F172A] tracking-tight">Agregar Registro</h3>
                    <p className="text-[#475569] font-bold tracking-widest font-meta-mono uppercase text-[0.7rem]">Agrega un nuevo contacto a tu lista.</p>
                  </div>
                </header>
                <form onSubmit={handleAddContact} className="space-y-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[0.8rem] font-bold text-[#0F172A] tracking-widest px-1">Nombre</label>
                      <input
                        required
                        type="text"
                        placeholder="Matias Fernandez"
                        className="w-full px-6 py-4 rounded-[20px] bg-gray-50 border-2 border-transparent focus:bg-white focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] transition-all text-[0.95rem] font-bold outline-none placeholder:text-[#64748B]"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.8rem] font-bold text-[#0F172A] tracking-widest px-1">Email</label>
                      <input
                        required
                        type="email"
                        placeholder="matias@ejemplo.com"
                        className="w-full px-6 py-4 rounded-[20px] bg-gray-50 border-2 border-transparent focus:bg-white focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] transition-all text-[0.95rem] font-bold outline-none placeholder:text-[#64748B]"
                        value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.8rem] font-bold text-[#0F172A] tracking-widest px-1">Estado</label>
                      <div className="relative">
                        <select
                          className="w-full px-6 py-4 pr-12 rounded-[20px] bg-gray-50 border-2 border-transparent focus:bg-white focus:ring-4 focus:ring-[#0D9488]/5 focus:border-[#0D9488] transition-all text-[0.95rem] font-bold outline-none appearance-none cursor-pointer"
                          value={newContact.status}
                          onChange={(e) => setNewContact({ ...newContact, status: e.target.value })}
                        >
                          <option value="Prospecto">Prospecto</option>
                          <option value="Cliente">Cliente</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6 text-[#64748B]">
                          <ChevronDown size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-5 rounded-[24px] text-[0.9rem] font-black uppercase tracking-[0.15em] text-white bg-[#0D9488] hover:bg-[#0F766E] shadow-xl shadow-[#0D9488]/30 transition-all active:scale-[0.98]"
                  >
                    Agregar Contacto
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* List Header */}
          <div className="flex justify-between items-end mb-10 w-full border-b border-gray-100 pb-8">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-[#0F172A] text-[2.2rem] font-bold leading-tight">Contactos</h1>
              <p className="text-[#0F172A] text-[1rem] opacity-80">Gestiona tus contactos y prospectos</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-[7px] px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#0D9488] border border-[#0D9488] shadow-lg transition-all hover:bg-[#0F766E] hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>Agregar Contacto</span>
            </button>
          </div>

          {/* List Table */}
          <div className="bg-white/85 backdrop-blur-[16px] border border-white shadow-xl rounded-3xl flex flex-col min-h-[500px] w-full mt-6 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-visible w-full" ref={dropdownRef}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-[0.75rem] font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-8 py-5 w-[60px] text-center">
                      <input type="checkbox" onChange={toggleSelectAll} className="rounded border-gray-300" />
                    </th>
                    <th className="px-6 py-5 min-w-[200px] text-left">Contacto</th>
                    <th className="px-6 py-5 text-center">Email</th>
                    <th className="px-6 py-5 text-center w-[120px]">Estado</th>
                    <th className="px-6 py-5 text-center w-[80px]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="group hover:bg-emerald-50/30 transition-all duration-200">
                      <td className="px-8 py-5 text-center">
                        <input type="checkbox" checked={selectedContacts.includes(contact.id)} onChange={() => toggleSelectContact(contact.id)} className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-5 cursor-pointer" onClick={() => setViewingContact(contact)}>
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm text-gray-700 bg-[#F8FAFC]">
                            {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div className="font-bold text-gray-900 group-hover:text-[#0D9488] transition-colors">{contact.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center text-gray-600 text-[0.9rem] font-medium">{contact.email}</td>
                      <td className="px-6 py-5 text-center">{getStatusBadge(contact.status)}</td>
                      <td className="px-6 py-5 text-center relative">
                        <button onClick={() => setOpenDropdownId(openDropdownId === contact.id ? null : contact.id)} className="p-2.5 rounded-xl text-gray-400 hover:text-[#0D9488] hover:bg-emerald-50"><MoreHorizontal size={22} /></button>
                        {openDropdownId === contact.id && (
                          <div className="absolute right-12 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[60] text-left animate-in fade-in zoom-in duration-200">
                            <button onClick={() => { setViewingContact(contact); setOpenDropdownId(null); }} className="w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#0D9488] flex items-center gap-3"><User size={16} />Ver perfil</button>
                            <button onClick={() => handleDeleteContact(contact.id)} className="w-full px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-3"><Trash2 size={16} />Eliminar</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Contacts;
