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
import {UpdateItemForm} from "~/components/formHandlers/itemForms/updateItemForm";
export default function ItemEdit () {
    const params = useParams()

    const id = params.id
    const [token] = useCookies("auth_token")

    const [item, setItem] = useState<Item | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/items/${params.id}`
    const {isLoading, error, result} = useApi<Item>({
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
            setItem(result)
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
                        <BreadcrumbLink href="/items">Items</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/items/${id}`}>{result?.name ?? (<Spinner/>)}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={"border-1 p-4 space-y-4 py-4"}>
                {isLoading && <Spinner/>}
                {!isLoading && item && (<UpdateItemForm item={item}/>)}
            </div>
        </div>
    )
}