import {useForm} from "react-hook-form";
import {string, z} from "zod";
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
import type {Warehouse} from "~/types/warehouse";

const formUpdateSchema = z.object({
    name: z.string().nonempty("Name field cant be empty").optional(),
    location: z.string().nonempty("Location field cannot be empty").optional(),
    capacity: z.string().optional()
})

type UpdateWarehouseFormProps = {
    warehouse: Warehouse;
}

export function UpdateWarehouseUpdForm({warehouse}: UpdateWarehouseFormProps) {
    const form = useForm<z.infer<typeof formUpdateSchema>>({
        resolver: zodResolver(formUpdateSchema),
    })

    const [data, setData] = useState<z.infer<typeof formUpdateSchema> | FormData | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/warehouses/${warehouse.id}`
    const [token] = useCookies("auth_token")

    const navigate = useNavigate()

    useEffect(() => {
        if (warehouse) {
            form.reset({
                name: warehouse.name,
                location: warehouse.location,
                capacity: String(warehouse.capacity)
            })
        }
    }, [warehouse, form])

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
        if (isSubmitting) setIsSubmitting(false)
    }, [isSubmitting])

    useEffect(() => {
        if (!isLoading && result) navigate(`/warehouses/${warehouse.id}`)
    }, [result])


    function onSubmit(values: z.infer<typeof formUpdateSchema>) {
        setData(values)
        setIsSubmitting(true)
    }

    const handleRevertBtn = () => {
        if (warehouse) {
            form.reset({
                name: warehouse.name,
                location: warehouse.location,
                capacity: String(warehouse.capacity)
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                <h4 className="text-lg">Edit Warehouse</h4>
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
                    name={"location"}
                    render={({field}) => (
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
                    name={"capacity"}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                                <Input type={"number"} min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button variant={"outline"} onClick={handleRevertBtn} type={"button"} disabled={typeof warehouse?.id !== "number"}>
                        Revert
                    </Button>
                    <Button type="submit" className={cn("")} disabled={typeof warehouse?.id !== "number"} >
                        {isLoading ? <Spinner text={"Saving..."} isWhite/> : "Save changes"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}