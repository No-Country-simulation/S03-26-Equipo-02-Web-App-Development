export interface ApiTask {
  id: string;
  contact: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
    phone: string | null;
    email: string | null;
    segmentType: string;
    createdAt: string;
    updatedAt: string;
  };
  title: string;
  description: string | null;
  complete: boolean;
  priority: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
}