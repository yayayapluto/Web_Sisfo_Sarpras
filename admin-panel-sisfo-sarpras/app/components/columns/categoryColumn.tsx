import type { ColumnDef } from "@tanstack/react-table";
import type { Category } from "~/types/category";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { ArrowUpRight, MoreVertical } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { useState } from "react";
import {makeDash} from "~/utils/string-formatter";
import {Spinner} from "~/components/ui/spinner";
import {floor} from "@floating-ui/utils";
import {Separator} from "~/components/ui/separator";
import {UpdateCategoryForm} from "~/components/formHandlers/categoryForm";

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
        header: "Created_at"
    },
    {
        accessorKey: "updated_at",
        header: "Updated_at"
    },
    {
        header: "Action",
        cell: ({ row }) => {
            const category = row.original;

            const [onEdit, setOnEdit] = useState<boolean>(false);
            const [slug, setSlug] = useState<string>(category.slug);
            const [name, setName] = useState<string>(category.name);
            const [description, setDescription] = useState<string>(category.description ?? "");

            const toggleOnEdit = () => {
                setOnEdit(!onEdit);
            };

            const [isLoading, setIsLoading] = useState(false)
            const simulateLoading = () => {
                setIsLoading(true)
                setTimeout(() => setIsLoading(false), Math.floor(Math.random() * 1000 + 200))
            }

            return (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant={"outline"}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <MoreVertical />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>View Category Details</DialogTitle>
                            <DialogDescription>
                                Here are the details for the category: {category.name}
                            </DialogDescription>
                        </DialogHeader>
                        <Separator/>
                        <div className="grid gap-4 py-2">
                            <Button className={cn(`max-w-1/3 p-4 ${onEdit && "bg-tb hover:bg-tb-sec text-white"}`)} variant={onEdit ? "default" : "outline"} onClick={toggleOnEdit}>
                                {onEdit ? "Disable" : "Enable"} edit
                            </Button>
                            <UpdateCategoryForm slug={category.slug} onEdit={onEdit} />
                        </div>
                    </DialogContent>
                </Dialog>
            );
        }
    }
];