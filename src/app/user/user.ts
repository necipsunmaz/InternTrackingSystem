export interface IUser {
    userid: string;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    isEnbaled: boolean;
    department: string;
    role: string;
    password?: string;
    lastlogin?: string;
}