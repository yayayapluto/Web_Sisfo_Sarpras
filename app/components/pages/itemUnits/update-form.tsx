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
import type {Item} from "~/types/item";
import {UpdateItemUnitForm} from "~/components/formHandlers/itemUnitForms/updateItemUnitForm";
import type {ItemUnit} from "~/types/itemUnit";
export default function ItemUnitEdit () {
    const params = useParams()

    const sku = params.sku
    const [token] = useCookies("auth_token")

    const [itemUnit, setItemUnit] = useState<ItemUnit | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/itemUnits/${params.sku}`
    const {isLoading, error, result} = useApi<ItemUnit>({
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
            setItemUnit(result)
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
                        <BreadcrumbLink href="/item-units">Item Units</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/items-units/${sku}`}>{result?.sku ?? (<Spinner/>)}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={"border-1 p-4 space-y-4"}>
                {isLoading && <Spinner/>}
                {!isLoading && itemUnit && (<UpdateItemUnitForm itemUnit={itemUnit}/>)}
            </div>
        </div>
    )
}