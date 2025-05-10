import type { Mandatory } from "./mandatory"
import type { User } from "./user"

export type Log = Mandatory & {
    entity: string
    entity_id: number
    type: "create" | "update" | "delete"
    old_value: string
    new_value: string
    ip_address: string
    user_agent: string
    performed_by: number
    performer?: User
}