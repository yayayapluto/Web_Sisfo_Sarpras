import type {Mandatory} from "~/types/mandatory";
import type {User} from "~/types/user";
import type {BorrowDetail} from "~/types/borrowDetail";
import type {ItemUnit} from "~/types/itemUnit";

export type ReturnDetail = Mandatory & {
    item_unit_id: number
    return_request_id: number
    item_unit?: ItemUnit
}