import type {Category} from "~/types/category";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {useCookies} from "~/hooks/use-cookies";
import {useNavigate} from "react-router";
import useApi from "~/hooks/use-api";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/components/ui/form";
import {Input} from "~/components/ui/input";
import {Textarea} from "~/components/ui/textarea";
import {cn} from "~/lib/utils";
import {Button} from "~/components/ui/button";
import {Spinner} from "~/components/ui/spinner";
import type {User} from "~/types/user";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {ScrollArea} from "~/components/ui/scroll-area";

const formUpdateSchema = z.object({
    username: z.string().nonempty("Name field cant be empty").optional(),
    password: z.string().nonempty("Password field cant be empty").min(8, "Minimal password length is 8").optional(),
    email: z.string().email().optional(),
    phone: z.string().min(8).optional(),
    role: z.string().nonempty("Role field cant be empty").optional(),
})

type UpdateUserFormProps = {
    user: User;
}

export function UpdateUserForm({user}: UpdateUserFormProps) {
    const form = useForm<z.infer<typeof formUpdateSchema>>({
        resolver: zodResolver(formUpdateSchema),
    })

    const navigate = useNavigate()

    const [data, setData] = useState<z.infer<typeof formUpdateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [token] = useCookies("auth_token")

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/users/${user.id}`
    const { isLoading, result } = useApi<User>({
        url: url,
        headers: {
            Authorization: "Bearer " + token
        },
        method: "PUT",
        data: data,
        trigger: isSubmitting
    });

    useEffect(() => {
        if (!isLoading && result) navigate(`/users/${user.id}`)
    }, [result])

    useEffect(() => {
        if (isSubmitting) setIsSubmitting(false)
    }, [isSubmitting])


    function onSubmit(values: z.infer<typeof formUpdateSchema>) {
        setData(values)
        setIsSubmitting(true)
        form.reset({
            username: undefined,
            email: undefined,
            password: undefined,
            phone: undefined,
            role: undefined,
        })
    }

    useEffect(() => {
        form.reset({
            username: user.username,
            email: user.email ?? undefined,
            phone: user.phone ?? undefined,
            role: user.role,
        })
    }, [])

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
                                <Input {...field} />
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
                                <Input {...field} type={"password"} />
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
                                <Input type={"email"} {...field} />
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
                                <Input type={"tel"} {...field} />
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
                                <Select onValueChange={field.onChange} defaultValue={user.role}>
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
                <Button type="submit" className={cn("bg-tb hover:bg-tb-sec w-full")} >
                    {isLoading ? <Spinner text={"Submitting..."} isWhite/> : "Submit"}
                </Button>
            </form>
        </Form>
    )
}