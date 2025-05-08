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
import {UpdateUserForm} from "~/components/formHandlers/userForms/updateUserForm";
import type {User} from "~/types/user";
export default function UserEdit () {
    const params = useParams()

    const id = params.id
    const [token] = useCookies("auth_token")

    const [user, setUser] = useState<User | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/users/${params.id}`
    const {isLoading, error, result} = useApi<User>({
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
            setUser(result)
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
                        <BreadcrumbLink href={`/users/${id}`}>{user?.username}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={"border-1 p-4 space-y-4"}>
                {isLoading && <Spinner/>}
                {!isLoading && user && (<UpdateUserForm user={user}/>)}
            </div>
        </div>
    )
}