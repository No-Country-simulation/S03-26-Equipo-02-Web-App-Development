import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Star,
  Archive,
  Pin,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Mic,
  ChevronRight,
  Mail,
  MapPin,
  Building2,
  Clock,
} from 'lucide-react';

/* ─── Tipos ─── */
interface Message {
  id: number;
  text: string;
  time: string;
  sender: 'me' | 'them';
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  role: string;
  email: string;
  company: string;
  location: string;
  pinned?: boolean;
  messages: Message[];
}

/* ─── Datos de ejemplo ─── */
const conversations: Conversation[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Perfecto, agendo la demo para el jueves.',
    time: '12:34',
    unread: 2,
    online: true,
    role: 'Directora de Marketing',
    email: 'sarah.j@empresa.com',
    company: 'TechVision Corp',
    location: 'Buenos Aires, AR',
    pinned: true,
    messages: [
      { id: 1, text: 'Hola Sarah, ¿pudiste revisar la propuesta que te envié ayer?', time: '11:20', sender: 'me', status: 'read' },
      { id: 2, text: 'Sí, la revisé con el equipo. Nos encantó la parte de automatización.', time: '11:32', sender: 'them' },
      { id: 3, text: '¡Genial! ¿Les gustaría agendar una demo en vivo?', time: '11:45', sender: 'me', status: 'read' },
      { id: 4, text: '¿Podría ser esta semana?', time: '11:46', sender: 'me', status: 'read' },
      { id: 5, text: 'Perfecto, agendo la demo para el jueves.', time: '12:34', sender: 'them' },
    ],
  },
  {
    id: 2,
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Te envío los documentos de seguridad por email.',
    time: '10:15',
    unread: 0,
    online: true,
    role: 'CTO',
    email: 'david.p@innovatech.com',
    company: 'InnovaTech',
    location: 'Córdoba, AR',
    messages: [
      { id: 1, text: 'David, necesito los documentos de compliance para cerrar la integración.', time: '09:00', sender: 'me', status: 'read' },
      { id: 2, text: 'Claro, déjame buscarlos. ¿Necesitas el certificado ISO también?', time: '09:15', sender: 'them' },
      { id: 3, text: 'Sí, por favor, ISO 27001 y SOC 2.', time: '09:20', sender: 'me', status: 'read' },
      { id: 4, text: 'Te envío los documentos de seguridad por email.', time: '10:15', sender: 'them' },
    ],
  },
  {
    id: 3,
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    lastMessage: '¡Gracias por el seguimiento! Todo en orden.',
    time: 'Ayer',
    unread: 0,
    online: false,
    role: 'Gerente de Operaciones',
    email: 'emma.d@globalnet.com',
    company: 'GlobalNet Solutions',
    location: 'Rosario, AR',
    messages: [
      { id: 1, text: 'Emma, ¿cómo va la implementación del módulo de reportes?', time: '14:00', sender: 'me', status: 'read' },
      { id: 2, text: 'Va muy bien, el equipo está al 80% de avance.', time: '14:30', sender: 'them' },
      { id: 3, text: 'Excelente. Te mando el checklist de QA para la revisión final.', time: '15:00', sender: 'me', status: 'read' },
      { id: 4, text: '¡Gracias por el seguimiento! Todo en orden.', time: '15:45', sender: 'them' },
    ],
  },
  {
    id: 4,
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Necesito una cotización actualizada para Q2.',
    time: 'Ayer',
    unread: 1,
    online: false,
    role: 'VP de Ventas',
    email: 'michael.c@nexusgroup.com',
    company: 'Nexus Group',
    location: 'Mendoza, AR',
    pinned: true,
    messages: [
      { id: 1, text: 'Hola Michael, ¿cómo estás? Vi que expira el contrato el mes que viene.', time: '09:00', sender: 'me', status: 'delivered' },
      { id: 2, text: 'Necesito una cotización actualizada para Q2.', time: '16:30', sender: 'them' },
    ],
  },
  {
    id: 5,
    name: 'Ana Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'El reporte mensual está listo para revisión.',
    time: 'Lun',
    unread: 0,
    online: false,
    role: 'Analista de Datos',
    email: 'ana.r@dataflow.com',
    company: 'DataFlow Analytics',
    location: 'Santiago, CL',
    messages: [
      { id: 1, text: 'Ana, ¿tienes los KPIs del último trimestre?', time: '10:00', sender: 'me', status: 'read' },
      { id: 2, text: 'Sí, estoy terminando de compilar los datos.', time: '10:30', sender: 'them' },
      { id: 3, text: 'El reporte mensual está listo para revisión.', time: '11:15', sender: 'them' },
    ],
  },
  {
    id: 6,
    name: 'Carlos Méndez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Adjunto el contrato firmado.',
    time: 'Lun',
    unread: 0,
    online: true,
    role: 'Director Legal',
    email: 'carlos.m@legalcorp.com',
    company: 'LegalCorp',
    location: 'Lima, PE',
    messages: [
      { id: 1, text: 'Carlos, ¿ya se firmó el NDA?', time: '13:00', sender: 'me', status: 'read' },
      { id: 2, text: 'Adjunto el contrato firmado.', time: '14:20', sender: 'them' },
    ],
  },
];

/* ─── Componente Principal ─── */
const Messaging = () => {
  const [activeConversation, setActiveConversation] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [msgs, setMsgs] = useState<Record<number, Message[]>>(() => {
    const init: Record<number, Message[]> = {};
    conversations.forEach((c) => (init[c.id] = [...c.messages]));
    return init;
  });
  const [showContactInfo, setShowContactInfo] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = conversations.find((c) => c.id === activeConversation)!;
  const activeMessages = msgs[activeConversation] || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const pinnedConvos = filteredConversations.filter((c) => c.pinned);
  const otherConvos = filteredConversations.filter((c) => !c.pinned);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      status: 'sent',
    };
    setMsgs((prev) => ({ ...prev, [activeConversation]: [...(prev[activeConversation] || []), msg] }));
    setNewMessage('');
    inputRef.current?.focus();
  };

  /* ─── Status icon helper ─── */
  const StatusIcon = ({ status }: { status?: string }) => {
    if (status === 'read') return <CheckCheck size={14} className="text-emerald-500" />;
    if (status === 'delivered') return <CheckCheck size={14} className="text-gray-400" />;
    return <Check size={14} className="text-gray-400" />;
  };

  return (
    <main className="flex-1 flex overflow-hidden">
      {/* ═══════════ PANEL IZQUIERDO — LISTA DE CONVERSACIONES ═══════════ */}
      <section className="w-[340px] flex flex-col border-r border-emerald-500/[0.08] bg-white/60 backdrop-blur-xl">
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[1.25rem] font-semibold text-gray-900 tracking-tight">Mensajes</h2>
            <div className="flex items-center gap-1">
              <span className="bg-emerald-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-[0_2px_8px_rgba(16,185,129,0.3)]">
                {conversations.reduce((a, c) => a + c.unread, 0)}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2.5 bg-white px-3.5 py-2.5 rounded-xl border border-emerald-500/[0.08] shadow-[0_2px_8px_rgba(16,185,129,0.03)] transition-all duration-200 focus-within:border-emerald-500/40 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.12)]">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar conversaciones…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-[0.9rem] text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2.5">
          {pinnedConvos.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-[0.08em] text-gray-400 font-semibold">
                <Pin size={12} />
                Fijados
              </div>
              {pinnedConvos.map((c) => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  isActive={c.id === activeConversation}
                  onClick={() => setActiveConversation(c.id)}
                />
              ))}
            </>
          )}

          {otherConvos.length > 0 && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-2 mt-1 text-xs uppercase tracking-[0.08em] text-gray-400 font-semibold">
                <Clock size={12} />
                Recientes
              </div>
              {otherConvos.map((c) => (
                <ConversationItem
                  key={c.id}
                  conversation={c}
                  isActive={c.id === activeConversation}
                  onClick={() => setActiveConversation(c.id)}
                />
              ))}
            </>
          )}
        </div>
      </section>

      {/* ═══════════ PANEL CENTRAL — CHAT ═══════════ */}
      <section className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-white/40 to-transparent">
        {/* Chat Header */}
        <div className="h-[72px] flex items-center justify-between px-6 border-b border-emerald-500/[0.06] bg-white/70 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={active.avatar} alt={active.name} className="w-10 h-10 rounded-full object-cover" />
              {active.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="text-[0.95rem] font-semibold text-gray-900">{active.name}</h3>
              <span className="text-xs text-gray-500">
                {active.online ? (
                  <span className="text-emerald-500 font-medium">En línea</span>
                ) : (
                  'Desconectado'
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-emerald-500/[0.06] hover:text-emerald-600 transition-colors">
              <Phone size={18} />
            </button>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-emerald-500/[0.06] hover:text-emerald-600 transition-colors">
              <Video size={18} />
            </button>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-emerald-500/[0.06] hover:text-emerald-600 transition-colors">
              <Star size={18} />
            </button>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-emerald-500/[0.06] hover:text-emerald-600 transition-colors">
              <Archive size={18} />
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button
              onClick={() => setShowContactInfo(!showContactInfo)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${showContactInfo ? 'bg-emerald-500/10 text-emerald-600' : 'text-gray-500 hover:bg-emerald-500/[0.06] hover:text-emerald-600'}`}
            >
              <ChevronRight size={18} className={`transition-transform duration-200 ${showContactInfo ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
          {/* Date separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200/70" />
            <span className="text-xs text-gray-400 font-medium bg-white/80 px-3 py-1 rounded-full border border-gray-100">Hoy</span>
            <div className="flex-1 h-px bg-gray-200/70" />
          </div>

          {activeMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-1 animate-[fadeSlideIn_0.25s_ease-out]`}
            >
              <div
                className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-[0.9rem] leading-relaxed relative group ${msg.sender === 'me'
                  ? 'bg-emerald-500 text-white rounded-br-md shadow-[0_2px_12px_rgba(16,185,129,0.25)]'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100'
                  }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === 'me' ? 'text-emerald-100' : 'text-gray-400'}`}>
                  <span className="text-[0.7rem]">{msg.time}</span>
                  {msg.sender === 'me' && <StatusIcon status={msg.status} />}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-5 py-4 border-t border-emerald-500/[0.06] bg-white/70 backdrop-blur-xl shrink-0">
          <div className="flex items-end gap-3">
            <div className="flex gap-1">
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-emerald-500/[0.06] hover:text-emerald-500 transition-colors">
                <Paperclip size={19} />
              </button>
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-emerald-500/[0.06] hover:text-emerald-500 transition-colors">
                <ImageIcon size={19} />
              </button>
            </div>

            <div className="flex-1 flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-emerald-500/[0.1] shadow-[0_2px_8px_rgba(16,185,129,0.03)] transition-all duration-200 focus-within:border-emerald-500/40 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]">
              <input
                ref={inputRef}
                type="text"
                placeholder="Escribe un mensaje…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="flex-1 bg-transparent border-none outline-none text-[0.9rem] text-gray-800 placeholder:text-gray-400"
              />
              <button className="text-gray-400 hover:text-emerald-500 transition-colors">
                <Smile size={20} />
              </button>
            </div>

            <div className="flex gap-1">
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-emerald-500/[0.06] hover:text-emerald-500 transition-colors">
                <Mic size={19} />
              </button>
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md ${newMessage.trim()
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_18px_rgba(16,185,129,0.45)] hover:-translate-y-px'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PANEL DERECHO — INFO DE CONTACTO ═══════════ */}
      <section
        className={`border-l border-emerald-500/[0.08] bg-white/60 backdrop-blur-xl flex flex-col transition-all duration-300 overflow-hidden ${showContactInfo ? 'w-[300px]' : 'w-0'
          }`}
      >
        <div className="p-6 pt-8 flex flex-col items-center text-center shrink-0">
          <div className="relative mb-4">
            <img src={active.avatar} alt={active.name} className="w-20 h-20 rounded-full object-cover shadow-[0_4px_20px_rgba(16,185,129,0.15)]" />
            {active.online && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white" />
            )}
          </div>
          <h3 className="text-[1.05rem] font-bold text-gray-900 mb-0.5">{active.name}</h3>
          <span className="text-sm text-gray-500">{active.role}</span>
        </div>

        <div className="px-5">
          <div className="bg-white/80 rounded-xl border border-emerald-500/[0.06] p-4 space-y-3.5 shadow-[0_2px_10px_rgba(16,185,129,0.03)]">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={15} className="text-emerald-500 shrink-0" />
              <span className="text-gray-700 truncate">{active.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building2 size={15} className="text-emerald-500 shrink-0" />
              <span className="text-gray-700">{active.company}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={15} className="text-emerald-500 shrink-0" />
              <span className="text-gray-700">{active.location}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 mt-5">
          <h4 className="text-xs uppercase tracking-[0.08em] text-gray-400 font-semibold mb-3 px-1">Acciones Rápidas</h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/80 border border-emerald-500/[0.06] text-gray-600 text-xs font-medium hover:bg-emerald-500/[0.06] hover:text-emerald-600 hover:border-emerald-500/20 transition-all duration-200">
              <Phone size={16} />
              Llamar
            </button>
            <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/80 border border-emerald-500/[0.06] text-gray-600 text-xs font-medium hover:bg-emerald-500/[0.06] hover:text-emerald-600 hover:border-emerald-500/20 transition-all duration-200">
              <Video size={16} />
              Videollamada
            </button>
            <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/80 border border-emerald-500/[0.06] text-gray-600 text-xs font-medium hover:bg-emerald-500/[0.06] hover:text-emerald-600 hover:border-emerald-500/20 transition-all duration-200">
              <Mail size={16} />
              Email
            </button>
            <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/80 border border-emerald-500/[0.06] text-gray-600 text-xs font-medium hover:bg-emerald-500/[0.06] hover:text-emerald-600 hover:border-emerald-500/20 transition-all duration-200">
              <Star size={16} />
              Favorito
            </button>
          </div>
        </div>

        {/* Shared Files placeholder */}
        <div className="px-5 mt-5">
          <h4 className="text-xs uppercase tracking-[0.08em] text-gray-400 font-semibold mb-3 px-1">Archivos Compartidos</h4>
          <div className="space-y-2">
            {[
              { name: 'Propuesta_Q2.pdf', size: '2.4 MB' },
              { name: 'Contrato_NDA.docx', size: '1.1 MB' },
              { name: 'Reporte_KPIs.xlsx', size: '856 KB' },
            ].map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/80 border border-emerald-500/[0.06] hover:border-emerald-500/20 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Paperclip size={14} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[0.82rem] font-medium text-gray-800 truncate">{file.name}</span>
                  <span className="text-[0.7rem] text-gray-400">{file.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

/* ─── Subcomponente: Item de conversación ─── */
const ConversationItem = ({
  conversation: c,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-0.5 text-left transition-all duration-200 ${isActive
      ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/[0.03] border-l-[3px] border-emerald-500'
      : 'hover:bg-emerald-500/[0.04] border-l-[3px] border-transparent'
      }`}
  >
    <div className="relative shrink-0">
      <img src={c.avatar} alt={c.name} className="w-11 h-11 rounded-full object-cover" />
      {c.online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
      )}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-0.5">
        <span className={`text-[0.9rem] font-semibold truncate ${isActive ? 'text-emerald-700' : 'text-gray-900'}`}>
          {c.name}
        </span>
        <span className="text-[0.72rem] text-gray-400 shrink-0 ml-2">{c.time}</span>
      </div>
      <p className="text-[0.82rem] text-gray-500 truncate leading-snug">{c.lastMessage}</p>
    </div>

    {c.unread > 0 && (
      <span className="bg-emerald-500 text-white text-[0.7rem] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-[0_2px_6px_rgba(16,185,129,0.3)] shrink-0">
        {c.unread}
      </span>
    )}
  </button>
);

export default Messaging;
