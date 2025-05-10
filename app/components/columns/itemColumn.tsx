import type { ColumnDef } from "@tanstack/react-table";
import type {Item} from "~/types/item";
import {useNavigate} from "react-router";
import {Button} from "~/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";


export const ItemColumn: ColumnDef<Item>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "image_url",
        header: "Image",
        cell: ({row}) => {
            const imageUrl = row.original.image_url
            return (
                <div className="size-16 p-2 border-1 rounded-sm">
                    <img src={imageUrl} alt={"image"} className={"object-contain size-full"}/>
                </div>
            )
        }
    },
    {
        accessorKey: "category.name",
        header: "Category",
        cell: ({row}) => {
            const category = row.original.category
            return (
                typeof category !== "undefined" && category !== null ? (
                    <a href={`/categories/${category.slug}`} className={"underline"}>{category.name}</a>
                ) : (
                    <p className={"text-muted-foreground"}>Missing category</p>
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
            const item = row.original;
            const navigate = useNavigate()

            return (
                <Button variant={"outline"} onClick={() => {
                    navigate(`/items/${item.id}`)
                }}>
                    <SquareArrowOutUpRight/>
                </Button>
            );
        }
    }
];