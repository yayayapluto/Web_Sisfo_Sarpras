import {useNavigate, useParams} from "react-router";
import useApi from "~/hooks/use-api";
import {useCookies} from "~/hooks/use-cookies";
import React, {useEffect, useState} from "react";
import {Separator} from "~/components/ui/separator";
import {DataTable} from "~/components/ui/data-table";
import {ItemColumn} from "~/components/columns/itemColumn";
import {Spinner} from "~/components/ui/spinner";
import {Button} from "~/components/ui/button";
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
import {cn} from "~/lib/utils";
import type {Warehouse} from "~/types/warehouse";
import {itemUnitColumn} from "~/components/columns/itemUnitColumn";
import {Badge} from "~/components/ui/badge";


export default function WarehouseDetail() {
    const params = useParams()
    const navigate = useNavigate()

    const id = params.id
    const [token] = useCookies("auth_token")

    const [warehouse, setWarehouse] = useState<Warehouse | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/warehouses/${params.id}`
    const {isLoading, error, result} = useApi<Warehouse>({
        url: url,
        headers: {
            Authorization: `Bearer ${token}`
        },
        trigger: refetch
    })

    useEffect(() => {
        setRefetch(false)
    }, [refetch])

    useEffect(() => {
        if (!isLoading && error === null && result !== null) {
            setWarehouse(result)
        }
    }, [isLoading, error, result])

    const [isDeleting, setIsDeleting] = useState(false)
    const {isLoading: isDeleteLoading} = useApi<Warehouse>({
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
            if (!isDeleteLoading) navigate("/warehouses")
        }
    }, [isDeleting])

    return (
        <div className="container mx-auto space-y-4 py-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/warehouses">Warehouse</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{isLoading ? <Spinner/> : warehouse?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-4">
            <div className={"border-1 rounded-sm p-4"}>
                {isLoading && <Spinner/>}
                {!isLoading && (
                    <>
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium leading-none flex flex-col">
                                <p>{warehouse?.name}</p>
                            </h4>
                            <div className="text-sm text-muted-foreground space-y-2">
                                <p>
                                    Location: {warehouse?.location}
                                </p>
                                <p>
                                    Maximum Capacity: {warehouse?.capacity}
                                </p>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-wrap items-center gap-2">
                            <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Created at ${warehouse?.created_at}`}</p>
                            <Separator orientation="vertical" />
                            <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Last Update at ${warehouse?.updated_at}`}</p>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-col gap-2">
                            <Button variant={"default"} onClick={() => navigate(`/warehouses/${id}/edit`)}>
                                Edit this warehouse
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button variant={"outline"} className={cn("w-full")}>
                                        Delete this warehouse
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure want to delete this warehouse?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. You will need to create this warehouse again
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => setIsDeleting(true)} className={cn("")}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </>
                )}
            </div>
            <div className={"border-1 rounded-sm p-4 space-y-4 " }>
                {isLoading && <Spinner/>}
                {!isLoading && (
                    <>
                        <div className="flex justify-start items-center gap-2">
                            <h4 className={"text-lg font-normal"}>
                                List item units in this item
                            </h4>
                            <Badge className={cn("px-4")}>{warehouse?.item_units?.length ?? 0}</Badge>
                        </div>
                        <Separator/>
                        {warehouse?.item_units && <DataTable columns={itemUnitColumn} data={warehouse?.item_units}/>}
                    </>
                )}
            </div>
            </div>
        </div>
    )
}