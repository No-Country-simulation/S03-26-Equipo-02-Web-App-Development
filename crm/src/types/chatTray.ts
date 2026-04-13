export type Channel = 'email' | 'wa' | 'messenger';
export type ProspectStatus = 'prospecto' | 'cliente' | 'prospecto-cálido' | 'startup' | 'agencia' | 'empresa';

export interface ChatTag {
  id: string;
  label: string;
  color?: string; 
}

export interface ConversationPreview {
  id: string;
  contactName: string;
  contactEmail: string;
  lastMessage: string;
  timestamp: string;     
  unreadCount: number;
  channel: Channel;
  tags: ProspectStatus[];
  isActive?: boolean;    
}

export interface DetailedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;          
  companyType?: string;   
  avatarUrl?: string;
}

export interface InboxState {
  conversations: ConversationPreview[];
  selectedId: string | null;
  filter: 'todas' | 'no-leidos' | 'prospectos' | 'clientes';
}