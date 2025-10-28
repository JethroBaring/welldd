export interface Site {
    id: number;
    site_name: string;
    site_address: string;
    site_officer_id: string;
    site_contact_no: string;
    response_units?: ResponseUnit[];
    users?: User[];
    createdAt: string;
    deletedAt: string;
}

export interface ResponseUnit {
    description: string;
    contact_no: string;
}

export interface User {
    id: string;
    name: string;
    role: string;
}
