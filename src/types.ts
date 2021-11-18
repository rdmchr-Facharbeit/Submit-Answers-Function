import type { Models } from "node-appwrite";

type User = {
    created: number,
    data: string,
    userId: string,
    rating: number,
    finished: boolean
} & Models.Document;

type Data = {
    userId: string,
    email: string,
    password: string,
    confirmPassword: string,
    resets: number,
} & Models.Document;

export {
    User,
    Data
}