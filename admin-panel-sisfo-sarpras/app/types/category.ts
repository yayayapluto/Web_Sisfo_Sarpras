import type {Mandatory} from "~/types/mandatory";

export type Category = {
    slug: string,
    name: string,
    description: string | null,
} & Mandatory