import type {Mandatory} from "~/types/mandatory";
import type {Warehouse} from "~/types/warehouse";
import type {Item} from "~/types/item";
import type {BorrowDetail} from "~/types/borrowDetail";
import type {ReturnDetail} from "~/types/returnDetail";

export type ItemUnit = Mandatory & {
    sku: string
    condition: string
    notes?: string
    acquisition_source: string
    acquisition_date: string
    acquisition_notes?: string
    status: 'available' | 'borrowed' | 'unknown'
    quantity: number
    qr_image_url: string
    item_id: number
    warehouse_id: number
    current_location: string
    item?: Item
    warehouse?: Warehouse
    borrow_details?: BorrowDetail[]
    return_details?: ReturnDetail[]
}