import type { ColumnDef } from "@tanstack/react-table";
import {useNavigate} from "react-router";
import {Button} from "~/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";
import type {Warehouse} from "~/types/warehouse";
import type {BorrowRequest} from "~/types/borrowRequest";
import type {BorrowDetail} from "~/types/borrowDetail";


export const BorrowDetailColumn: ColumnDef<BorrowDetail>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "borrow_request_id",
        header: "Borrow Request ID",
    },
    {
        accessorKey: "itemUnit.sku",
        header: "Item Unit SKU",
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