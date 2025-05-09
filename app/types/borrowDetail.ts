import type {Mandatory} from "~/types/mandatory";
import type {User} from "~/types/user";
import type {ItemUnit} from "~/types/itemUnit";

export type BorrowDetail = Mandatory & {
    quantity: number
    borrow_request_id: number
    item_unit_id: number
    item_unit?: ItemUnit
}