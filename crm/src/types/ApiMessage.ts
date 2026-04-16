 export interface ApiMessage {
  id: string;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    phone: string | null;
    email: string | null;
    segmentType: string;
  };
  channel: {
    id: string;
    type: string;
  };
  status: string;
  content: string;
  isRead: boolean;
  direction: string;
  twilioSid: string | null;
  createdAt: string;
  updatedAt: string;
}