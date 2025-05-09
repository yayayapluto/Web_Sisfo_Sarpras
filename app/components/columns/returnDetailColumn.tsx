import type { ColumnDef } from "@tanstack/react-table";
import {useNavigate} from "react-router";
import {Button} from "~/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";
import type {Warehouse} from "~/types/warehouse";
import type {BorrowRequest} from "~/types/borrowRequest";
import type {ReturnRequest} from "~/types/returnRequest";
import type {ReturnDetail} from "~/types/returnDetail";


export const ReturnDetailColumn: ColumnDef<ReturnDetail>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "item_unit_id",
        header: "Item unit id",
    },
    {
        accessorKey: "return_request_id",
        header: "Return request id",
    },
    {
        accessorKey: "created_at",
        header: "Created at",
    },
    {
        accessorKey: "updated_at",
        header: "Updated at"
    },
    {
        header: "Action",
        cell: ({ row }) => {
            const item = row.original;
            const navigate = useNavigate()

            return (
                <Button variant={"outline"} onClick={() => {
                    // navigate(`/categories/${category.slug}`)
                }}>
                    <SquareArrowOutUpRight/>
                </Button>
            );
        }
    }
];