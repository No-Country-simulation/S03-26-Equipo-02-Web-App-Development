export interface ApiNotes {
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
    description: string;
    createdAt: string;
    updatedAt: string;
}