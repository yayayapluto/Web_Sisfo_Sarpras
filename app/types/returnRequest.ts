import type {Mandatory} from "~/types/mandatory";
import type {User} from "~/types/user";
import type {BorrowDetail} from "~/types/borrowDetail";
import type {ReturnDetail} from "~/types/returnDetail";
import type {BorrowRequest} from "~/types/borrowRequest";

export type ReturnRequest = Mandatory & {
    status: 'pending' | 'approved' | 'rejected'
    notes?: string
    borrow_request_id: number
    handled_by?: number
    borrow_request?: BorrowRequest
    return_details?: ReturnDetail[]
    handler?: User
}