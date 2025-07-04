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
import type {Item} from "~/types/item";
import type {PaginationResponse} from "~/types/paginationResponse";
import type {Category} from "~/types/category";
import {Skeleton} from "~/components/ui/skeleton";
import {RadioGroup, RadioGroupItem} from "~/components/ui/radio-group";
import {Label} from "~/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {Separator} from "~/components/ui/separator";
import {ScrollArea} from "~/components/ui/scroll-area";

const formUpdateSchema = z.object({
    name: z.string().nonempty("Name field cant be empty").optional(),
    type: z.string().nonempty("Type field cant be empty").optional(),
    description: z.string().nonempty("Description field cant be empty").optional(),
    image: z.any().optional(),
    category: z.string().nonempty("Category field cant be empty").optional()
})

type UpdateItemProp = {
    item: Item;
}

export function UpdateItemForm({item}: UpdateItemProp) {
    const form = useForm<z.infer<typeof formUpdateSchema>>({
        resolver: zodResolver(formUpdateSchema),
    })

    const navigate = useNavigate()

    const [data, setData] = useState<z.infer<typeof formUpdateSchema> | FormData | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [token] = useCookies("auth_token")

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/items/${item.id}`
    const { isLoading, result } = useApi<Item>({
        url: url,
        headers: {
            Authorization: "Bearer " + token
        },
        method: "POST",
        data: data,
        trigger: isSubmitting
    });

    const [imagePreview, setImagePreview] = useState<string | undefined>()
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            form.setValue("image", [file])
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(undefined);
        }
    };

    useEffect(() => {
        if (isSubmitting) setIsSubmitting(false)
    }, [isSubmitting])


    function onSubmit(values: z.infer<typeof formUpdateSchema>) {

        const formData = new FormData()
        if (values.name) formData.append("name", values.name)
        if (values.type) formData.append("type", values.type)
        if (values.description) formData.append("description", values.description)
        if (values.image) formData.append("image", (values.image as File[])[0])
        if (values.category) formData.append("category_slug", values.category)

        setData(formData)
        setIsSubmitting(true)
        form.reset({
            name: "",
            description: "",
            image: undefined,
            type: "",
            category: ""
        })
        setImagePreview(undefined)
    }

    useEffect(() => {
        if (!isLoading && result) {
            navigate(`/items/${item.id}`)
        }
    }, [result])

    const [fetchCategories, setFetchCategories] = useState(true)
    const [categorySearch, setCategorySearch] = useState("")

    const [categoryUrl, setCategoryUrl] = useState(`${baseUrl}/api/admin/categories`)
    const {isLoading: isCategoryLoading, result: categoryResult} =  useApi<PaginationResponse<Category>>({
        url: categoryUrl,
        headers: {
            Authorization: "Bearer " + token
        },
        method: "GET",
        trigger: fetchCategories
    });

    useEffect(() => {
        setCategorySearch("")
        setImagePreview(item.image_url)
        form.reset({
            name: item.name,
            description: item.description,
            image: undefined,
        })
    }, [])

    useEffect(() => {
        if (fetchCategories) setFetchCategories(false)
    }, [fetchCategories])

    useEffect(() => {
        const newUrl = `${baseUrl}/api/admin/categories?search=${categorySearch}`
        setCategoryUrl(newUrl)
        setFetchCategories(true)
    }, [categorySearch])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <h4 className="text-lg">Update Item</h4>
                <div className="grid grid-col-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea className={cn("resize-none h-44")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input onChange={handleImageChange} type={"file"} accept={"image/*"}/>
                                    </FormControl>
                                    <div className="w-full h-32 border-1 p-2">
                                        {imagePreview ? (
                                            <img src={imagePreview} className={"size-full object-contain"} alt="Image preview"/>
                                        ): (
                                            <Skeleton className={"size-full flex justify-center items-center"}>
                                                <p>Image will shown here</p>
                                            </Skeleton>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Types</FormLabel>
                                    <FormControl>
                                        <RadioGroup defaultValue={item.type} onValueChange={field.onChange}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="consumable" id="consumable" />
                                                <Label htmlFor="consumable">Consumable</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="non-consumable" id="non-consumable" />
                                                <Label htmlFor="non-consumable">Non Consumable</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={item.category?.slug}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <div className={"p-2"}>
                                                    <Input type={"text"} value={categorySearch} placeholder={"Search Category..."} onChange={e => setCategorySearch(e.target.value)}/>
                                                </div>
                                                <Separator className={cn("my-2")} />
                                                <SelectGroup>
                                                    <ScrollArea className={cn("h-64")}>
                                                        {isCategoryLoading && (
                                                            <div className="flex w-full h-64 justify-center items-center">
                                                                <Spinner/>
                                                            </div>
                                                        )}
                                                        {categoryResult?.data.map(category => (
                                                            <SelectItem
                                                                value={category.slug}>{category.name}</SelectItem>
                                                        ))}
                                                    </ScrollArea>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit" className={cn(" w-full")} >
                    {isLoading ? <Spinner text={"Saving..."} isWhite/> : "Save Changes"}
                </Button>
            </form>
        </Form>
    )
}