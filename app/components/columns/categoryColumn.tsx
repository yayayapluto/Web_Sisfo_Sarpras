import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "~/types/category";
import { Button } from "~/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";

import {useNavigate} from "react-router";


export const CategoryColumn: ColumnDef<Category>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "slug",
        header: "Slug",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
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
            const category = row.original;
            const navigate = useNavigate()

            return (
                <Button variant={"outline"} onClick={() => navigate(`/categories/${category.slug}`)}>
                    <SquareArrowOutUpRight/>
                </Button>
            );
        }
    }
];