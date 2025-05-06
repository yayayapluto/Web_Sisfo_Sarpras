"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {any, object, z} from "zod"
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";
import {Textarea} from "~/components/ui/textarea";
import {cn} from "~/lib/utils";
import useApi from "~/hooks/use-api";
import type {PaginationResponse} from "~/types/paginationResponse";
import type {Category} from "~/types/category";
import {useEffect, useState} from "react";
import {Spinner} from "~/components/ui/spinner";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"


const formCreateSchema = z.object({
    name: z.string().nonempty("Name field cant be empty"),
    description: z.string().optional()
})

const formUpdateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional()
})

export function CreateCategoryForm() {
    const form = useForm<z.infer<typeof formCreateSchema>>({
        resolver: zodResolver(formCreateSchema),
        defaultValues: {
            description: ""
        }
    })

    const [data, setData] = useState<z.infer<typeof formCreateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const url = "http://localhost:8000/api/admin/categories"
    const { isLoading, error, result } = useApi<Category>({
        url: url,
        headers: {
            Authorization: "Bearer 2|jYR7NbnViNb3pbCruJ2VkOlgfLhvxxYd6T1dU1Gn8713760a"
        },
        method: "POST",
        data: data,
        trigger: isSubmitting
    });

    useEffect(() => {
        if (isSubmitting) setIsSubmitting(false)
    }, [isSubmitting])


    function onSubmit(values: z.infer<typeof formCreateSchema>) {
        setData(values)
        setIsSubmitting(true)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"description"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea className={cn("resize-none h-32")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormDescription className={cn("text-sm")}>
                    * This site not support live reload yet, please reload manually :3
                </FormDescription>
                <Button type="submit" className={cn("bg-tb hover:bg-tb-sec w-full")} >
                    {isLoading ? <Spinner text={"Submitting..."} isWhite/> : "Submit"}
                </Button>
            </form>
        </Form>
    )
}

type UpdateCategoryFormProps = {
    slug: string;
    onEdit: boolean;
}
export function UpdateCategoryForm({slug, onEdit = false}: UpdateCategoryFormProps) {
    const form = useForm<z.infer<typeof formUpdateSchema>>({
        resolver: zodResolver(formUpdateSchema),
        defaultValues: {
            description: ""
        }
    })

    const [data, setData] = useState<z.infer<typeof formUpdateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [isDelete, setIsDelete] = useState(false)

    const url = `http://localhost:8000/api/admin/categories/${slug}`

    const { isLoading: isFetching, error: fetchError, result: fetchData } = useApi<Category>({
        url: url,
        headers: {
            Authorization: "Bearer 2|jYR7NbnViNb3pbCruJ2VkOlgfLhvxxYd6T1dU1Gn8713760a"
        },
        method: "GET",
        trigger: true
    });

    const { isLoading: isDeleting, error: deleteError } = useApi<Category>({
        url: url,
        headers: {
            Authorization: "Bearer 2|jYR7NbnViNb3pbCruJ2VkOlgfLhvxxYd6T1dU1Gn8713760a"
        },
        method: "DELETE",
        trigger: isDelete
    });

    useEffect(() => {
        if (fetchData) {
            form.reset({
                name: fetchData.name,
                description: fetchData.description || ""
            })
        }
    }, [fetchData, form])

    const { isLoading, error, result } = useApi<Category>({
        url: url,
        headers: {
            Authorization: "Bearer 2|jYR7NbnViNb3pbCruJ2VkOlgfLhvxxYd6T1dU1Gn8713760a"
        },
        method: "PUT",
        data: data,
        trigger: isSubmitting
    });

    useEffect(() => {
        if (isSubmitting && isLoading) setIsSubmitting(false)
    }, [isSubmitting, isLoading])


    function onSubmit(values: z.infer<typeof formUpdateSchema>) {
        setData(values)
        setIsSubmitting(true)
    }

    const handleRevertBtn = () => {
        if (fetchData) {
            form.reset({
                name: fetchData.name,
                description: fetchData.description || ""
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
                <FormField
                    control={form.control}
                    name="name"
                    disabled={!onEdit}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    disabled={!onEdit}
                    name={"description"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea className={cn("resize-none h-32")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormDescription className={cn("text-sm")}>
                    * This site not support live reload yet, please reload manually :3
                </FormDescription>
                {onEdit ? (
                    <div className="flex justify-end gap-2">
                        <Button variant={"outline"} onClick={handleRevertBtn} type={"button"} disabled={fetchData?.slug === ""}>
                            Revert
                        </Button>
                        <Button type="submit" className={cn("bg-tb hover:bg-tb-sec")} disabled={fetchData?.slug === ""} >
                            {isLoading ? <Spinner text={"Saving..."} isWhite/> : "Save changes"}
                        </Button>
                    </div>
                ) : (
                    <Dialog>
                        <DialogTrigger>
                            <Button variant={"outline"} type={"button"} className={cn("w-full")} disabled={isFetching || isDeleting || fetchData?.slug === ""}>
                                Delete
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you absolutely sure wants to delete this category?</DialogTitle>
                            </DialogHeader>
                            <DialogFooter className="justify-end">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" className={cn("min-w-16")} onClick={() => {
                                        setIsDelete(true)
                                    }}>
                                        Yes
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button type="button" variant="default" className={cn("bg-tb hover:bg-tb-sec min-w-16")}>
                                        No
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </form>
        </Form>
    )
}