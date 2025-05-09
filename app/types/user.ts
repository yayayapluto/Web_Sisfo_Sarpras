import type {Mandatory} from "~/types/mandatory";

export type User = Mandatory & {
    username: string,
    email?: string | null,
    phone?: string | null,
    role: "user" | "admin",
}