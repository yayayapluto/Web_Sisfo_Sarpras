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
import {useCookies} from "~/hooks/use-cookies";
import type {Warehouse} from "~/types/warehouse";


const formCreateSchema = z.object({
    name: z.string().nonempty("Name field cant be empty").min(3, "Name length minimum is 3"),
    location: z.string().nonempty(("Location field cant be empty")),
    capacity: z.number().min(1, "Capacity minimum is 1")
})

const formUpdateSchema = z.object({
    name: z.string().nonempty("Name field cant be empty").min(3, "Name length minimum is 3").optional(),
    location: z.string().nonempty(("Location field cant be empty")).optional(),
    capacity: z.number().min(1, "Capacity minimum is 1").optional()
})

export function CreateWarehouseForm() {
    const form = useForm<z.infer<typeof formCreateSchema>>({
        resolver: zodResolver(formCreateSchema),
    })

    const [data, setData] = useState<z.infer<typeof formCreateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [token] = useCookies("auth_token")
    const url = "http://localhost:8000/api/admin/warehouses"
    const { isLoading, error, result } = useApi<Warehouse>({
        url: url,
        headers: {
            Authorization: "Bearer " + token
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
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                                <Input type={"number"} min={1} max={1000} {...field} onChange={(e) => field.onChange(+e.target.value)} />
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

type UpdateWarehouseFormProps = {
    warehouse: Warehouse
    onEdit: boolean;
}

export function UpdateWarehouseForm({warehouse, onEdit = false}: UpdateWarehouseFormProps) {
    const form = useForm<z.infer<typeof formUpdateSchema>>({
        resolver: zodResolver(formUpdateSchema),
    })

    const [data, setData] = useState<z.infer<typeof formUpdateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [isDelete, setIsDelete] = useState(false)

    const url = `http://localhost:8000/api/admin/warehouses/${warehouse.id}`

    const [token] = useCookies("auth_token")
    const { isLoading: isFetching, error: fetchError, result: fetchData } = useApi<Warehouse>({
        url: url,
        headers: {
            Authorization: "Bearer " + token
        },
        method: "GET",
        trigger: true
    });

    const { isLoading: isDeleting, error: deleteError } = useApi<Warehouse>({
        url: url,
        headers: {
            Authorization: "Bearer " + token
        },
        method: "DELETE",
        trigger: isDelete
    });

    useEffect(() => {
        if (fetchData) {
            form.reset({
                name: warehouse.name,
                location: warehouse.location,
                capacity: warehouse.capacity
            })
        }
    }, [fetchData, form])

    const { isLoading, error, result } = useApi<Warehouse>({
        url: url,
        headers: {
            Authorization: "Bearer " + token
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
                name: warehouse.name,
                location: warehouse.location,
                capacity: warehouse.capacity
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isFetching || !onEdit}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isFetching || !onEdit}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                                <Input disabled={isFetching || !onEdit} type={"number"} min={1} max={1000} {...field} onChange={(e) => field.onChange(+e.target.value)} />
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
                        <Button variant={"outline"} onClick={handleRevertBtn} type={"button"} disabled={typeof fetchData?.id === "undefined"}>
                            Revert
                        </Button>
                        <Button type="submit" className={cn("bg-tb hover:bg-tb-sec")} disabled={typeof fetchData?.id === "undefined"} >
                            {isLoading ? <Spinner text={"Saving..."} isWhite/> : "Save changes"}
                        </Button>
                    </div>
                ) : (
                    <Dialog>
                        <DialogTrigger>
                            <Button variant={"outline"} type={"button"} className={cn("w-full")} disabled={isFetching || isDeleting || typeof fetchData?.id === "undefined"}>
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