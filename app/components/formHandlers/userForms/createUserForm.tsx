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
import type {User} from "~/types/user";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {Separator} from "~/components/ui/separator";
import {ScrollArea} from "~/components/ui/scroll-area";


const formCreateSchema = z.object({
    username: z.string().nonempty("Name field cant be empty"),
    password: z.string().nonempty("Password field cant be empty").min(8, "Minimal password length is 8"),
    email: z.string().email().optional(),
    phone: z.string().min(8).optional(),
    role: z.string().nonempty("Role field cant be empty"),
})

export function CreateUserForm() {
    const form = useForm<z.infer<typeof formCreateSchema>>({
        resolver: zodResolver(formCreateSchema)
    })

    const [data, setData] = useState<z.infer<typeof formCreateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [token] = useCookies("auth_token")

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/users`
    const { isLoading } = useApi<User>({
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
            username: undefined,
            email: undefined,
            phone: undefined,
            role: "",
            password: undefined
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <h4 className="text-lg">Create User</h4>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input {...field} type={"password"} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Select {...field} defaultValue="" onValueChange={field.onChange} disabled={isSubmitting}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <ScrollArea>
                                                <SelectItem value={"user"}>User</SelectItem>
                                                <SelectItem value={"admin"}>Admin</SelectItem>
                                            </ScrollArea>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className={cn(" w-full")} >
                    {isLoading ? <Spinner text={"Submitting..."} isWhite/> : "Submit"}
                </Button>
            </form>
        </Form>
    )
}