import type {Mandatory} from "~/types/mandatory";
import type {Item} from "~/types/item";

export type Category = {
    slug: string,
    name: string,
    description: string | null,
    items?: Item[]
} & Mandatory