import {useNavigate, useParams} from "react-router";
import useApi from "~/hooks/use-api";
import type {User} from "~/types/user";
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
import {Badge} from "~/components/ui/badge";


export default function UserDetail() {
    const params = useParams()
    const navigate = useNavigate()

    const id = params.id
    const [token] = useCookies("auth_token")

    const [user, setUser] = useState<User | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/users/${id}`
    const {isLoading, error, result} = useApi<User>({
        url: url,
        method: "GET",
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

    const [isDeleting, setIsDeleting] = useState(false)
    const {isLoading: isDeleteLoading} = useApi<User>({
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
            if (!isDeleteLoading) navigate("/users")
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
                        <BreadcrumbLink href="/users">Users</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{isLoading ? <Spinner/> : user?.username}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full py-4">
            <div className={"border-1 rounded-sm p-4"}>
                {isLoading && <Spinner/>}
                {!isLoading && (
                    <>
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium leading-none flex flex-col">
                                <p>{user?.username}</p>
                            </h4>
                            <Separator className={"my-4"}/>
                            <p className="text-sm text-muted-foreground">
                                <span className={"font-normal"}>Email: </span>
                                {user?.email ?? "-"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className={"font-normal"}>Phone: </span>
                                {user?.phone ?? "-"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className={"font-normal"}>Role: </span>
                                {user?.role}
                            </p>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center space-x-4">
                            <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Created at ${user?.created_at}`}</p>
                            <Separator orientation="vertical" />
                            <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Last Update at ${user?.updated_at}`}</p>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-col gap-2">
                            <Button variant={"default"} onClick={() => navigate(`/users/${id}/edit`)}>
                                Edit this user
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button variant={"outline"} className={cn("w-full")}>
                                        Delete this user
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure want to delete this user?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. You will need to create this user again
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
            </div>
        </div>
    )
}