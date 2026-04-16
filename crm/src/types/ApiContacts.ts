export interface ApiContact {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
  phone: string | null;
  email: string | null;
  segmentType: string;
}