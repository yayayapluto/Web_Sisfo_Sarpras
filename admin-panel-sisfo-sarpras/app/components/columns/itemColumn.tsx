import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { ArrowUpRight, MoreVertical } from "lucide-react";
import { cn } from "~/lib/utils";
import { useState } from "react";
import {Separator} from "~/components/ui/separator";
import type {Item} from "~/types/item";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"


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
    },
    {
        accessorKey: "category.slug",
        header: "Category",
    },
    {
        accessorKey: "created_at",
        header: "Created_at"
    },
    {
        accessorKey: "updated_at",
        header: "Updated_at"
    },
    {
        header: "Action",
    }
];