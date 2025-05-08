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
import type {ItemUnit} from "~/types/itemUnit";
import {Calendar} from "~/components/ui/calendar";

const formUpdateSchema = z.object({
    condition: z.string().nonempty("Condition field cant be empty").optional(),
    notes: z.string().optional().optional(),
    acquisition_source: z.string().nonempty("Acquisition Source field cant be empty").optional(),
    acquisition_date: z.any().optional(),
    acquisition_notes: z.string().optional().optional(),
    quantity: z.string().nonempty("Quantity field cant be empty").optional(),
    item_id: z.string().nonempty("Item_id field cant be empty").optional(),
    warehouse_id: z.string().nonempty("Warehouse_id field cant be empty").optional(),
})

type UpdateItemUnitProp = {
    itemUnit: ItemUnit;
}

export function UpdateItemUnitForm({itemUnit}: UpdateItemUnitProp) {
    const form = useForm<z.infer<typeof formUpdateSchema>>({
        resolver: zodResolver(formUpdateSchema),
    })

    const navigate = useNavigate()

    const [data, setData] = useState<z.infer<typeof formUpdateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [token] = useCookies("auth_token")

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/itemUnits/${itemUnit.sku}`
    const { isLoading, result } = useApi<ItemUnit>({
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


    function onSubmit(values: z.infer<typeof formUpdateSchema>) {
        setData({
            ...values,
            acquisition_date: values.acquisition_date.toISOString().split("T")[0]
        })
        setIsSubmitting(true)
        form.reset({
            condition: "",
            acquisition_source: "",
            acquisition_date: new Date(),
            quantity: "",
            item_id: "",
            warehouse_id: "",
        })
    }

    useEffect(() => {
        if (!isLoading && result) {
            navigate(`/item-units/${itemUnit.sku}`)
        }
    }, [result])

    useEffect(() => {
        form.reset({
            condition: itemUnit.condition,
            acquisition_source: itemUnit.acquisition_source,
            acquisition_notes: itemUnit.acquisition_notes,
            notes: itemUnit.notes,
            acquisition_date: new Date(itemUnit.acquisition_date),
            quantity: String(itemUnit.quantity),
            item_id: String(itemUnit.item_id),
            warehouse_id: String(itemUnit.warehouse_id),
        })
        setDate(new Date(itemUnit.acquisition_date))
    }, [])

    const [date, setDate] = useState<Date | undefined>(new Date())

    const [fetchItems, setFetchItems] = useState(true)
    const [itemSearch, setItemSearch] = useState("")
    const [itemUrl, setItemUrl] = useState(`${baseUrl}/api/admin/items`)
    const {isLoading: isItemLoading, result: itemResult} =  useApi<PaginationResponse<Item>>({
        url: itemUrl,
        headers: {
            Authorization: "Bearer " + token
        },
        method: "GET",
        trigger: fetchItems
    });
    useEffect(() => {
        if (fetchItems) setFetchItems(false)
    }, [fetchItems])
    useEffect(() => {
        const newUrl = `${baseUrl}/api/admin/items?search=${itemSearch}`
        setItemUrl(newUrl)
        setFetchItems(true)
    })

    const [fetchWarehouses, setFetchWarehouses] = useState(true)
    const [warehouseSearch, setWarehouseSearch] = useState("")
    const [warehouseUrl, setWarehouseUrl] = useState(`${baseUrl}/api/admin/warehouses`)
    const {isLoading: isWarehouseLoading, result: warehouseResult} =  useApi<PaginationResponse<Warehouse>>({
        url: warehouseUrl,
        headers: {
            Authorization: "Bearer " + token
        },
        method: "GET",
        trigger: fetchWarehouses
    });
    useEffect(() => {
        if (fetchWarehouses) setFetchWarehouses(false)
    }, [fetchWarehouses])
    useEffect(() => {
        const newUrl = `${baseUrl}/api/admin/warehouses?search=${itemSearch}`
        setWarehouseUrl(newUrl)
        setFetchWarehouses(true)
    })

    const [inputQuantity, setInputQuantity] = useState(1)
    const [itemType, setItemType] = useState<'consumable' | 'non-consumable'>('non-consumable')
    useEffect(() => {
        if (itemType === "non-consumable") {
            setInputQuantity(1)
            form.setValue("quantity", "1")
        }
    }, [itemType])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <h4 className="text-lg">Create Item Unit</h4>
                <Separator/>
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col lg:flex-row gap-4 w-full">
                            <FormField
                                control={form.control}
                                name="acquisition_date"
                                render={({ field }) => (
                                    <FormItem className={"w-full"}>
                                        <FormLabel>Acquisition Date</FormLabel>
                                        <FormControl>
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                onDayClick={field.onChange}
                                                className="rounded-md border-1 w-full flex justify-center items-center"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className={"flex flex-col justify-between w-full gap-2"}>
                                <FormField
                                    control={form.control}
                                    name="acquisition_source"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Acquisition Source</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="acquisition_notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Acquisition Notes</FormLabel>
                                            <FormControl>
                                                <Textarea className={"resize-none h-54  "} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className={"flex flex-row gap-6"}>
                                <FormField
                                    control={form.control}
                                    name="condition"
                                    render={({ field }) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Condition</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem className={"w-full"}>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input type={"number"} disabled={itemType === "non-consumable"} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Textarea className={"h-54 resize-none"} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="item_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item</FormLabel>
                                    <FormControl>
                                        <Select defaultValue={String(itemUnit.item_id)} onValueChange={(value) => {
                                            form.setValue("item_id", value);
                                            const selectedItem = itemResult?.data.find(item => String(item.id) === value);
                                            if (selectedItem) {
                                                const quantity = selectedItem.type === "non-consumable" ? "1" : "";
                                                form.setValue("quantity", quantity);
                                                setItemType(selectedItem.type);
                                            }
                                        }}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Items" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <div className={"p-2"}>
                                                    <Input type={"text"} value={itemSearch} placeholder={"Search Item..."} onChange={e => setItemSearch(e.target.value)}/>
                                                </div>
                                                <Separator className={cn("my-2")} />
                                                <SelectGroup>
                                                    <ScrollArea className={cn("h-16")}>
                                                        {isItemLoading && (
                                                            <div className="flex w-full h-64 justify-center items-center">
                                                                <Spinner/>
                                                            </div>
                                                        )}
                                                        {itemResult?.data.map(item => (
                                                            <SelectItem
                                                                value={String(item.id)} onClick={() => {
                                                                setItemType(item.type)
                                                                form.setValue("quantity", item.type === "non-consumable" ? "1" : "")
                                                            }}>{item.name}</SelectItem>
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
                        <FormField
                            control={form.control}
                            name="warehouse_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Warehouse</FormLabel>
                                    <FormControl>
                                        <Select defaultValue={String(itemUnit.warehouse_id)} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Warehouse" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <div className={"p-2"}>
                                                    <Input type={"text"} value={warehouseSearch} placeholder={"Search Warehouse..."} onChange={e => setWarehouseSearch(e.target.value)}/>
                                                </div>
                                                <Separator className={cn("my-2")} />
                                                <SelectGroup>
                                                    <ScrollArea className={cn("h-16")}>
                                                        {isWarehouseLoading && (
                                                            <div className="flex w-full h-64 justify-center items-center">
                                                                <Spinner/>
                                                            </div>
                                                        )}
                                                        {warehouseResult?.data.map(warehouse => (
                                                            <SelectItem
                                                                value={String(warehouse.id)}>{warehouse.name}</SelectItem>
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
                <Button type="submit" className={cn("bg-tb hover:bg-tb-sec w-full")} >
                    {isLoading ? <Spinner text={"Saving..."} isWhite/> : "Save Changes"}
                </Button>
            </form>
        </Form>
    )
}