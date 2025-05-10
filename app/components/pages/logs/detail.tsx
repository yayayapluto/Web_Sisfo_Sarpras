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
import type { BorrowRequest } from "~/types/borrowRequest";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Log } from "~/types/log";


export default function LogDetail() {
    const params = useParams()
    const navigate = useNavigate()

    const id = params.id
    const [token] = useCookies("auth_token")

    const [log, setLog] = useState<Log | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/logs/${params.id}`
    const { isLoading, error, result } = useApi<Log>({
        url: url,
        headers: {
            Authorization: `Bearer ${token}`
        },
        trigger: refetch
    })

    useEffect(() => setRefetch(true), [])

    useEffect(() => {
        if (refetch) setRefetch(false)
    }, [refetch])

    useEffect(() => {
        if (!isLoading && error === null && result !== null) {
            setLog(result)
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
                        <BreadcrumbLink href="/logs">Log Activities</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{isLoading ? <Spinner /> : log?.id}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="w-full flex flex-col gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {!isLoading && (
                        <>
                            <div className={"border-1 rounded-sm p-4 col-span-2"}>
                                <div className="space-y-4">
                                    <h4 className="text-lg">
                                        Log Activity Overview
                                    </h4>
                                    <Separator className={"my-4"} />
                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Entity:
                                            </span>
                                            {` ${log?.entity}`}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Entity id:
                                            </span>
                                            {` ${log?.entity_id}`}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Type:
                                            </span>
                                            {` ${log?.type}`}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                IP Address:
                                            </span>
                                            {` ${log?.ip_address}`}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                User Agent:
                                            </span>
                                            {` ${log?.user_agent}`}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Performed By:
                                            </span>
                                            {` ${log?.performer?.username ?? "system"}`}
                                        </p>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex items-center space-x-4">
                                    <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Created at ${log?.created_at}`}</p>
                                    <Separator orientation="vertical" />
                                    <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Last Update at ${log?.updated_at}`}</p>
                                </div>
                            </div>
                            <div className="border-1 rounded-sm p-4">
                                <h4 className="text-lg">
                                    Old Value
                                </h4>
                                <Separator className={"my-4"} />
                                {log?.old_value ? (
                                    <div>
                                        {Object.entries(JSON.parse(log.old_value)).filter(([key, value]) => key !== "password" && key !== "remember_token").map(([key, value]) => (
                                            <p className="text-muted-foreground">
                                            <span className="text-black">
                                                {key}:
                                            </span>
                                            {` ${value}`}
                                        </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm">
                                        There is no old value
                                    </p>
                                )}
                            </div>
                            <div className="border-1 rounded-sm p-4">
                                <h4 className="text-lg">
                                    New Value
                                </h4>
                                <Separator className={"my-4"} />
                                {log?.new_value ? (
                                    <div>
                                        {Object.entries(JSON.parse(log.new_value)).map(([key, value]) => (
                                            <p className="text-muted-foreground">
                                            <span className="text-black">
                                                {key}:
                                            </span>
                                            {` ${value}`}
                                        </p>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm">
                                        There is no new value
                                    </p>
                                )}
                                {/* 
                                {"id": 1, "role": "admin", "username": "admin", "created_at": "2025-05-09T22:46:46.000000Z", "updated_at": "2025-05-09T22:46:46.000000Z"}
                                */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}