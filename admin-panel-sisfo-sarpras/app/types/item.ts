import type {Mandatory} from "~/types/mandatory";
import type {Category} from "~/types/category";
import type {ItemUnit} from "~/types/itemUnit";

export type Item = Mandatory & {
    name: string
    type: 'consumable' | 'non-consumable'
    description: string
    image_url: string
    category_id: number
    category?: Category
    item_units?: ItemUnit[]
}