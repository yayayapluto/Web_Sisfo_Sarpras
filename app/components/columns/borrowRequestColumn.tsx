import type { ColumnDef } from "@tanstack/react-table";
import {useNavigate} from "react-router";
import {Button} from "~/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";
import type {Warehouse} from "~/types/warehouse";
import type {BorrowRequest} from "~/types/borrowRequest";


export const BorrowRequestColumn: ColumnDef<BorrowRequest>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "return_date_expected",
        header: "Return Date Expected",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "notes",
        header: "Notes",
    },
    {
        accessorKey: "user.username",
        header: "User",
    },
    {
        accessorKey: "handler.username",
        header: "Handled by",
        cell: ({row}) => row.original.handler?.username ?? "-"
    },
    {
        accessorKey: "created_at",
        header: "Created at"
    },
    {
        accessorKey: "updated_at",
        header: "Updated at"
    },
    {
        header: "Action",
        cell: ({ row }) => {
            const borrowRequest = row.original;
            const navigate = useNavigate()

            return (
                <Button variant={"outline"} onClick={() => {
                    navigate(`/borrow-requests/${borrowRequest.id}`)
                }}>
                    <SquareArrowOutUpRight/>
                </Button>
            );
        }
    }
];