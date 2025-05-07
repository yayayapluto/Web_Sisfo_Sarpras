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
import {useCookies} from "~/hooks/use-cookies";
import {useNavigate} from "react-router";


const formCreateSchema = z.object({
    name: z.string().nonempty("Name field cant be empty"),
    description: z.string().optional()
})

export function CreateCategoryForm() {
    const form = useForm<z.infer<typeof formCreateSchema>>({
        resolver: zodResolver(formCreateSchema),
        defaultValues: {
            description: "-"
        }
    })

    const [data, setData] = useState<z.infer<typeof formCreateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [token] = useCookies("auth_token")
    const url = "http://localhost:8000/api/admin/categories"
    const { isLoading, error, result } = useApi<Category>({
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
        form.reset({
            name: "",
            description: ""
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <h4 className="text-lg">Create Category</h4>
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
                <Button type="submit" className={cn("bg-tb hover:bg-tb-sec w-full")} >
                    {isLoading ? <Spinner text={"Submitting..."} isWhite/> : "Submit"}
                </Button>
            </form>
        </Form>
    )
}