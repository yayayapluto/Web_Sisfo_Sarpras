import type {Mandatory} from "~/types/mandatory";

export type Warehouse = Mandatory & {
    name: string
    location: string
    capacity: number
}