export interface User {
    _id:string,
    username:string,
    email:string,
    password:string,
    role:string,
    person: {
        first_name?:string,
        last_name?:string,
        gender?:string,
        address?:string,
        cell_number?:string,
        profile_picture?:string,
    }
}
export interface UserInput {
    username:string,
    email:string,
    password:string,
    role:string,
    person: {
        first_name?:string,
        last_name?:string,
        gender?:string,
        address?:string,
        cell_number?:string,
        profile_picture?:string,
    }
}