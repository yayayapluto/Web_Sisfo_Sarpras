import {useParams} from "react-router";
import {useCookies} from "~/hooks/use-cookies";
import React, {useEffect, useState} from "react";
import useApi from "~/hooks/use-api";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import {Spinner} from "~/components/ui/spinner";
import type {Warehouse} from "~/types/warehouse";
import {UpdateWarehouseUpdForm} from "~/components/formHandlers/warehouseForms/updateWarehouseForm";
export default function WarehouseEdit () {
    const params = useParams()

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

    return (
        <div className="container mx-auto space-y-4 py-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/warehouses">Warehouses</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/warehouses/${id}`}>{result?.name ?? (<Spinner/>)}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-1 lg:grid-cols-2 py-4">
            <div className={"border-1 rounded-sm p-4 space-y-4"}>
                {isLoading && <Spinner/>}
                {!isLoading && warehouse && (<UpdateWarehouseUpdForm warehouse={warehouse}/>)}
            </div>
            </div>
        </div>
    )
}