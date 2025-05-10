import { useNavigate, useParams } from "react-router";
import useApi from "~/hooks/use-api";
import { useCookies } from "~/hooks/use-cookies";
import React, { useEffect, useState } from "react";
import { Separator } from "~/components/ui/separator";
import { DataTable } from "~/components/ui/data-table";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { cn } from "~/lib/utils";
import type { Warehouse } from "~/types/warehouse";
import { Badge } from "~/components/ui/badge";
import { ArrowUpRight, ArrowUpRightFromCircle } from "lucide-react";
import type { ItemUnit } from "~/types/itemUnit";
import { itemUnitColumn } from "~/components/columns/itemUnitColumn";
import { BorrowDetailColumn } from "~/components/columns/borrowDetailColumn";
import { ReturnDetailColumn } from "~/components/columns/returnDetailColumn";


export default function ItemUnitDetail() {
    const params = useParams()
    const navigate = useNavigate()

    const sku = params.sku
    const [token] = useCookies("auth_token")

    const [itemUnit, setItemUnit] = useState<ItemUnit | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/itemUnits/${params.sku}`
    const { isLoading, error, result } = useApi<ItemUnit>({
        url: url,
        headers: {
            Authorization: `Bearer ${token}`
        },
        trigger: true
    })

    useEffect(() => setRefetch(true), [])

    useEffect(() => {
        if (refetch) setRefetch(false)
    }, [refetch])

    useEffect(() => {
        if (!isLoading && error === null && result !== null) {
            setItemUnit(result)
        }
    }, [isLoading, error, result])

    const [isDeleting, setIsDeleting] = useState(false)
    const { isLoading: isDeleteLoading } = useApi<Warehouse>({
        url: url,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        },
        trigger: isDeleting
    })
    useEffect(() => {
        if (isDeleting) {
            setIsDeleting(false)
            if (!isDeleteLoading) navigate("/item-units")
        }
    }, [isDeleting])

    return (
        <div className="container mx-auto space-y-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/item-units">Item-Units</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{isLoading ? <Spinner /> : itemUnit?.sku}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="w-full flex flex-col gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {!isLoading && (
                        <div className={"border-1 rounded-sm p-4"}>
                            <div className="space-y-4">
                                <h4 className="text-lg">
                                    {itemUnit?.sku}
                                </h4>
                                <Separator className={"my-4"} />
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <div className="border-1 rounded-sm size-36 p-2">
                                        <img src={itemUnit?.qr_image_url} alt={itemUnit?.sku} className="size-full object-contain" />
                                    </div>
                                    <p>
                                        <span className="text-black">
                                            Condition:
                                        </span> {itemUnit?.condition}
                                    </p>
                                    <p>
                                        <span className="text-black">
                                            Notes:
                                        </span> {itemUnit?.notes}
                                    </p>
                                    <p>
                                        <span className="text-black">
                                            Acquisition Source:
                                        </span> {itemUnit?.acquisition_source}
                                    </p>
                                    <p>
                                        <span className="text-black">
                                            Acquisition Date:
                                        </span> {itemUnit?.acquisition_date}
                                    </p>
                                    <p>
                                        <span className="text-black">
                                            Acquisition Note:
                                        </span> {itemUnit?.acquisition_notes}
                                    </p>
                                    <p>
                                        <span className="text-black">
                                            Status:
                                        </span> {itemUnit?.status}
                                    </p>
                                    <p>
                                        <span className="text-black">
                                            Quantity:
                                        </span> {itemUnit?.quantity}
                                    </p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex itemUnits-center space-x-4">
                                <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Created at ${itemUnit?.created_at}`}</p>
                                <Separator orientation="vertical" />
                                <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Last Update at ${itemUnit?.updated_at}`}</p>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex flex-col gap-2">
                                <Button variant={"default"} onClick={() => navigate(`/item-units/${itemUnit?.sku}/edit`)}>
                                    Edit this itemUnit
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <Button variant={"outline"} className={cn("w-full")}>
                                            Delete this itemUnit
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure want to delete this itemUnit?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. You will need to create this itemUnit again
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => setIsDeleting(true)} className={cn("")}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-2 justify-between">
                        {!isLoading && itemUnit?.item && (
                            <div className={"border-1 rounded-sm p-4"} >
                                <div className="flex flex-row items-center gap-2">
                                    <h4 className={"text-lg"}>Assigned item</h4>
                                    <Button variant={"outline"} className="size-6" onClick={() => navigate(`/items/${itemUnit?.item_id}`)}>
                                        <ArrowUpRight />
                                    </Button>
                                </div>
                                <Separator className={"my-4"} />
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium leading-none flex flex-col">
                                        <p>{itemUnit.item?.name}</p>
                                    </h4>
                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <div className="border-1 rounded-sm size-36 p-2">
                                            <img src={itemUnit.item?.image_url} alt={itemUnit.item?.name} className="size-full object-contain" />
                                        </div>
                                        <p>
                                            <span className="text-black">
                                                Type:
                                            </span> {itemUnit.item?.type}
                                        </p>
                                        <p>
                                            <span className="text-black">
                                                Description:
                                            </span> {itemUnit.item?.description}
                                        </p>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex itemUnits-center space-x-4">
                                    <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Created at ${itemUnit?.item?.created_at}`}</p>
                                    <Separator orientation="vertical" />
                                    <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Last Update at ${itemUnit?.item?.updated_at}`}</p>
                                </div>
                            </div>
                        )}
                        {!isLoading && itemUnit?.warehouse && (
                            <div className={"border-1 rounded-sm p-4"} >
                                <div className="flex flex-row items-center gap-2">
                                    <h4 className={"text-lg"}>Assigned warehouse</h4>
                                    <Button variant={"outline"} className="size-6" onClick={() => navigate(`/warehouses/${itemUnit?.warehouse_id}`)}>
                                        <ArrowUpRight />
                                    </Button>
                                </div>
                                <Separator className={"my-4"} />
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium leading-none flex flex-col">
                                        <p>{itemUnit?.warehouse?.name}</p>
                                    </h4>
                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <p>
                                            Location: {itemUnit?.warehouse?.location}
                                        </p>
                                        <p>
                                            Maximum Capacity: {itemUnit?.warehouse?.capacity}
                                        </p>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex itemUnits-center space-x-4">
                                    <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Created at ${itemUnit?.item?.created_at}`}</p>
                                    <Separator orientation="vertical" />
                                    <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Last Update at ${itemUnit?.item?.updated_at}`}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {!isLoading && itemUnit && (
                        <div className={"flex flex-col border-1 p-4 rounded-sm"}>
                            <h4 className={"text-lg flex items-center"}>
                                <span>List borrow details with this item unit</span>
                                <Badge className={cn("px-4 ml-2")}>{itemUnit.borrow_details?.length ?? 0}</Badge>
                            </h4>
                            <Separator className={"my-4"} />
                            {<DataTable columns={BorrowDetailColumn} data={itemUnit.borrow_details ?? []} />}
                        </div>
                    )}
                    {!isLoading && itemUnit && (
                        <div className={"flex flex-col border-1 p-4 rounded-sm"}>
                            <h4 className={"text-lg flex items-center"}>
                                <span>List return details with this item unit</span>
                                <Badge className={cn("px-4 ml-2")}>{itemUnit.return_details?.length ?? 0}</Badge>
                            </h4>
                            <Separator className={"my-4"} />
                            {<DataTable columns={ReturnDetailColumn} data={itemUnit.return_details ?? []} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}