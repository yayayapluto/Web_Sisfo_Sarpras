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
import {useNavigate} from "react-router";
import {useCookies} from "~/hooks/use-cookies";
import {toast} from "sonner";


const formLoginSchema = z.object({
    username: z.string().nonempty("Username field cannot be empty").min(4, "Minimum input length is 4").max(64, "Maximum input length is 64"),
    password: z.string().nonempty(("Password field cannot be empty")).min(6, "Minimum input length is 5").max(24, "Maximum input length is 24")
})


export function LoginFormZ() {
    const navigate = useNavigate()

    const [authInfo, setAuthInfo] = useCookies("auth_token", null)

    const form = useForm<z.infer<typeof formLoginSchema>>({
        resolver: zodResolver(formLoginSchema),
    })

    const [data, setData] = useState<z.infer<typeof formLoginSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const url = "http://localhost:8000/api/auth/login"
    const { isLoading, error, result } = useApi<{token: string, role: "admin" | "user"}>({
        url: url,
        method: "POST",
        data: data,
        trigger: isSubmitting,
        showToast: true
    });

    useEffect(() => {
        if (isSubmitting) setIsSubmitting(false)
    }, [isSubmitting])

    useEffect(() => {
        if (result !== null && result.role === "admin") {
            setAuthInfo(result.token)
            navigate("/dashboard", { replace: true, viewTransition: true })
        } else {
            if (result !== null && result.role !== "admin") toast("Only admin can login", {position: "top-center"})
        }
    }, [result, navigate])


    function onSubmit(values: z.infer<typeof formLoginSchema>) {
        setData(values)
        setIsSubmitting(true)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input  {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={"password"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type={"password"} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className={cn("bg-tb hover:bg-tb-sec w-full")} >
                    {isLoading ? <Spinner text={"Logging in..."} isWhite/> : "Login"}
                </Button>
            </form>
        </Form>
    )
}