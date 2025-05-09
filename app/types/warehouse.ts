import type {Mandatory} from "~/types/mandatory";
import type {ItemUnit} from "~/types/itemUnit";

export type Warehouse = Mandatory & {
    name: string
    location: string
    capacity: number
    item_units?: ItemUnit[]
}