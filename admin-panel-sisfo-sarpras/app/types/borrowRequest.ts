import type {Mandatory} from "~/types/mandatory";
import type {User} from "~/types/user";
import type {BorrowDetail} from "~/types/borrowDetail";

export type BorrowRequest = Mandatory & {
    return_date_expected: string
    status: 'pending' | 'approved' | 'rejected'
    notes?: string
    user_id: number
    approved_by: number
    user?: User
    approver?: User
    borrowDetails?: BorrowDetail
    returnRequest?: object
}