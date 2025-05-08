import type { ColumnDef } from "@tanstack/react-table";
import {useNavigate} from "react-router";
import {Button} from "~/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";
import type {Warehouse} from "~/types/warehouse";
import type {ItemUnit} from "~/types/itemUnit";


export const itemUnitColumn: ColumnDef<ItemUnit>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "sku",
        header: "SKU",
    },
    {
        accessorKey: "condition",
        header: "Condition",
    },
    {
        accessorKey: "notes",
        header: "Notes",
    },
    {
        accessorKey: "acquisition_source",
        header: "Acquisition Source"
    },
    {
        accessorKey: "acquisition_date",
        header: "Acquisition Date"
    },
    {
        accessorKey: "acquisition_notes",
        header: "Acquisition Notes"
    },
    {
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "quantity",
        header: "Quantity"
    },
    {
        accessorKey: "qr_image_url",
        header: "Qr Image",
        cell: ({row}) => {
            const imageUrl = row.original.qr_image_url
            return (
                <div className="size-12 p-2 border-1 rounded-sm">
                    <img src={imageUrl} alt={"image"} className={"object-contain size-full"}/>
                </div>
            )
        }
    },
    {
        accessorKey: "item.name",
        header: "Parent item",
        cell: ({row}) => {
            const item = row.original.item
            return (
                typeof item !== "undefined" ? (
                    <a href={`/items/${item.id}`} className={"underline"}>{item.name}</a>
                ) : (
                    <p className={"text-muted-foreground"}>Current item</p>
                )
            )
        }
    },
    {
        accessorKey: "warehouse.name",
        header: "Warehouse Source",
        cell: ({row}) => {
            const warehouse = row.original.warehouse
            return (
                typeof warehouse !== "undefined" ? (
                    <a href={`/warehouses/${warehouse.id}`} className={"underline"}>{warehouse.name}</a>
                ) : (
                    <p className={"text-muted-foreground"}>Current warehouse</p>
                )
            )
        }
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
            const itemUnit = row.original;
            const navigate = useNavigate()

            return (
                <Button variant={"outline"} onClick={() => {
                    navigate(`/item-units/${itemUnit.sku}`)
                }}>
                    <SquareArrowOutUpRight/>
                </Button>
            );
        }
    }
];