import {useParams} from "react-router";
import {useCookies} from "~/hooks/use-cookies";
import React, {useEffect, useState} from "react";
import type {Category} from "~/types/category";
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
import {UpdateCategoryForm} from "~/components/formHandlers/categoryForms/updateCategoryForm";
export default function CategoryEdit () {
    const params = useParams()

    const slug = params.slug
    const [token] = useCookies("auth_token")

    const [category, setCategory] = useState<Category | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/categories/${params.slug}`
    const {isLoading, error, result} = useApi<Category>({
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
            setCategory(result)
        }
    }, [isLoading, error, result])

    return (
        <div className="container mx-auto space-y-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/categories/${slug}`}>{slug}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={"border-1 p-4 space-y-4"}>
                {isLoading && <Spinner/>}
                {!isLoading && category && (<UpdateCategoryForm category={category}/>)}
            </div>
        </div>
    )
}