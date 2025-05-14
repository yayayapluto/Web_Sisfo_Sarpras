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
import {useCookies} from "~/hooks/use-cookies";
import type {Item} from "~/types/item";
import {
    Select,
    SelectContent, SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"

import {Skeleton} from "~/components/ui/skeleton";
import {RadioGroup} from "~/components/ui/radio-group";
import { RadioGroupItem } from "~/components/ui/radio-group"
import {Label} from "~/components/ui/label";
import type {PaginationResponse} from "~/types/paginationResponse";
import type {Category} from "~/types/category";
import {Separator} from "~/components/ui/separator";
import {ScrollArea} from "~/components/ui/scroll-area";
import {Calendar} from "~/components/ui/calendar";
import type {Warehouse} from "~/types/warehouse";
import type {ItemUnit} from "~/types/itemUnit";

const formCreateSchema = z.object({
    condition: z.string().nonempty("Condition field cant be empty"),
    notes: z.string().optional(),
    acquisition_source: z.string().nonempty("Acquisition Source field cant be empty"),
    acquisition_date: z.any(),
    acquisition_notes: z.string().optional(),
    quantity: z.string().nonempty("Quantity field cant be empty"),
    current_location: z.string().nonempty("Current location field cant be empty"),
    item_id: z.string().nonempty("Item_id field cant be empty"),
    warehouse_id: z.string().nonempty("Warehouse_id field cant be empty"),
})

export function CreateItemUnitForm() {
    const form = useForm<z.infer<typeof formCreateSchema>>({
        resolver: zodResolver(formCreateSchema),
        defaultValues: {
            acquisition_notes: "-",
            notes: "-"
        }
    })

    const [data, setData] = useState<z.infer<typeof formCreateSchema> | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [token] = useCookies("auth_token")

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/itemUnits`
    const { isLoading } = useApi<ItemUnit>({
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
        setData({
            ...values,
            acquisition_date: values.acquisition_date.toISOString().split("T")[0]
        })
        setIsSubmitting(true)
        form.reset({
            condition: "",
            acquisition_source: "",
            acquisition_date: new Date(),
            quantity: 1,
            item_id: "",
            warehouse_id: "",
        })
    }

    useEffect(() => {
        form.reset({
            condition: "",
            acquisition_source: "",
            acquisition_date: new Date(),
            quantity: "",
            item_id: "",
            warehouse_id: "",
        })
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
                                                <Input  {...field} />
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
                            name="current_location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Location</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="item_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(value) => {
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
                                                    <ScrollArea className={cn("h-32")}>
                                                        {isItemLoading && (
                                                            <div className="flex w-full h-32 justify-center items-center">
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
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Warehouse" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <div className={"p-2"}>
                                                    <Input type={"text"} value={warehouseSearch} placeholder={"Search Warehouse..."} onChange={e => setWarehouseSearch(e.target.value)}/>
                                                </div>
                                                <Separator className={cn("my-2")} />
                                                <SelectGroup>
                                                    <ScrollArea className={cn("h-32")}>
                                                        {isWarehouseLoading && (
                                                            <div className="flex w-full h-32 justify-center items-center">
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
                <Button type="submit" className={cn(" w-full")} >
                    {isLoading ? <Spinner text={"Submitting..."} isWhite/> : "Submit"}
                </Button>
            </form>
        </Form>
    )
}