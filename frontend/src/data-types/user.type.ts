export interface User {
    _id: string;
    email: string;
    password: string;
    role: string;
    person: Person;
    createdAt: string;
    updatedAt: string;
    last_seen?: string;
}

export interface UserInput {
    email: string;
    password: string;
    role: string;
    person: Person;
    last_seen?: string;
}

interface Person {
    first_name: string;
    last_name: string;
    gender: string;
    address: string;
    cell_number: string;
    profile_image_id?: string;
    profile_picture?: File;
}