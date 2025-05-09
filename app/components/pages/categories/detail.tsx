import {useNavigate, useParams} from "react-router";
import useApi from "~/hooks/use-api";
import type {Category} from "~/types/category";
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


export default function CategoryDetail() {
    const params = useParams()
    const navigate = useNavigate()

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

    const [isDeleting, setIsDeleting] = useState(false)
    const {isLoading: isDeleteLoading} = useApi<Category>({
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
            if (!isDeleteLoading) navigate("/categories")
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
                        <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{isLoading ? <Spinner/> : category?.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={"border-1 p-4"}>
                {isLoading && <Spinner/>}
                {!isLoading && (
                    <>
                        <div className="space-y-4">
                            <h4 className="text-lg font-medium leading-none flex flex-col">
                                <p>{category?.name}</p>
                                <span className="text-sm text-muted-foreground">
                                     ({category?.slug})
                                </span>
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {category?.description}
                            </p>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center space-x-4">
                            <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Created at ${category?.created_at}`}</p>
                            <Separator orientation="vertical" />
                            <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Last Update at ${category?.updated_at}`}</p>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex flex-col gap-2">
                            <Button variant={"default"} onClick={() => navigate(`/categories/${slug}/edit`)}>
                                Edit this category
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Button variant={"outline"} className={cn("w-full")}>
                                        Delete this category
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure want to delete this category?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. You will need to create this category again
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => setIsDeleting(true)} className={cn("bg-tb hover:bg-tb-sec")}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </>
                )}
            </div>
            <div className={"border-1 p-4 space-y-4"}>
                {isLoading && <Spinner/>}
                {!isLoading && (
                    <>
                        <div className="flex justify-start items-center gap-2">
                            <h4 className={"text-lg font-normal"}>
                                List item units in this item
                            </h4>
                            <Badge className={cn("px-4")}>{category?.items?.length ?? 0}</Badge>
                        </div>
                        <Separator/>
                        {category?.items && <DataTable columns={ItemColumn} data={category?.items}/>}
                    </>
                )}
            </div>
        </div>
    )
}