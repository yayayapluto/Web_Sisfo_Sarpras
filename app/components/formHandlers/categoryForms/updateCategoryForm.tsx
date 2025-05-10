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

const formUpdateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional()
})

type UpdateCategoryFormProps = {
    category: Category;
}

export function UpdateCategoryForm({category}: UpdateCategoryFormProps) {
    const form = useForm<z.infer<typeof formUpdateSchema>>({
        resolver: zodResolver(formUpdateSchema),
        defaultValues: {
            description: "-"
        }
    })

    const [data, setData] = useState<z.infer<typeof formUpdateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/categories/${category.slug}`
    const [token] = useCookies("auth_token")

    const navigate = useNavigate()

    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                description: category.description || "-"
            })
        }
    }, [category, form])

    const { isLoading, error, result } = useApi<Category>({
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
        if (!isLoading && result) navigate(`/categories/${result.slug}`)
    }, [result])


    function onSubmit(values: z.infer<typeof formUpdateSchema>) {
        setData(values)
        setIsSubmitting(true)
    }

    const handleRevertBtn = () => {
        if (category) {
            form.reset({
                name: category.name,
                description: category.description || "-"
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
                <h4 className="text-lg">Edit Category</h4>
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
                <div className="flex justify-end gap-2">
                    <Button variant={"outline"} onClick={handleRevertBtn} type={"button"} disabled={category?.slug === ""}>
                        Revert
                    </Button>
                    <Button type="submit" className={cn("")} disabled={category?.slug === ""} >
                        {isLoading ? <Spinner text={"Saving..."} isWhite/> : "Save changes"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}