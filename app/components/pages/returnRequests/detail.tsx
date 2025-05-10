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
import type { ReturnRequest } from "~/types/returnRequest";


export default function ReturnRequestDetail() {
    const params = useParams()
    const navigate = useNavigate()

    const id = params.id
    const [token] = useCookies("auth_token")

    const [returnRequest, setReturnRequest] = useState<ReturnRequest | undefined>()
    const [refetch, setRefetch] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL
    const url = `${baseUrl}/api/admin/return-requests/${params.id}`
    const { isLoading, error, result } = useApi<ReturnRequest>({
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
            setReturnRequest(result)
        }
    }, [isLoading, error, result])

    const [requestStatus, setRequestStatus] = useState<'approve' | 'reject' | undefined>()
    const [fireAction, setFireAction] = useState(false)
    const [actionUrl, setActionUrl] = useState("")
    const { isLoading: isActionLoading, result: actionResult } = useApi<string>({
        url: actionUrl,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        },
        trigger: fireAction
    })
    
    useEffect(() => {
            if (requestStatus) {
                setActionUrl(`${url}/${requestStatus}`);
            }
        }, [requestStatus]);
        
        useEffect(() => {
            if (actionUrl) {
                setFireAction(true);
            }
        }, [actionUrl]);
        
        useEffect(() => {
            if (!isActionLoading && actionResult) {
                setRefetch(true);
            }
        }, [isActionLoading, actionResult]);


    return (
        <div className="container mx-auto space-y-4 py-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/return-requests">Return Requests</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{isLoading ? <Spinner /> : returnRequest?.id}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="w-full flex flex-col gap-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {!isLoading && (
                        <>
                            <div className={"border-1 rounded-sm p-4"}>
                                <div className="space-y-4">
                                    <h4 className="text-lg">
                                        Return Request Overview
                                    </h4>
                                    <Separator className={"my-4"} />
                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Status:
                                            </span> {returnRequest?.status}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Notes:
                                            </span> {returnRequest?.notes}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Handled By:
                                            </span> {returnRequest?.handled_by ?? "-"}
                                        </p>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex items-center space-x-4">
                                    <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Created at ${returnRequest?.created_at}`}</p>
                                    <Separator orientation="vertical" />
                                    <p className={"text-xs lg:text-sm text-muted-foreground"}>{`Last Update at ${returnRequest?.updated_at}`}</p>
                                </div>
                                {returnRequest?.status === "pending" && (
                                    <>
                                        <Separator className="my-4" />
                                        <div className="flex flex-col gap-2">
                                            {!isActionLoading ? (
                                                <>
                                                    <Button variant={"default"} disabled={isActionLoading} onClick={() => {
                                                        setRequestStatus("approve")
                                                    }}>
                                                        Approve this return request
                                                    </Button>
                                                    <Button variant={"outline"} disabled={isActionLoading} onClick={() => {
                                                        setRequestStatus("approve")
                                                    }} >
                                                        Reject this return request
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button variant={"secondary"} disabled>
                                                    <Spinner />
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="border-1 rounded-sm p-4">
                                <div className="space-y-4">
                                    <div className="flex flex-row items-center gap-2">
                                        <h4 className={"text-lg"}>Assigned Borrow Request</h4>
                                        <Button variant={"outline"} className="size-6" onClick={() => navigate(`/borrow-requests/${returnRequest?.borrow_request_id}`)}>
                                            <ArrowUpRight />
                                        </Button>
                                    </div>
                                    <Separator className={"my-4"} />
                                    <div className="text-sm text-muted-foreground space-y-2">
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Return Date Expected:
                                            </span> {returnRequest?.borrow_request?.return_date_expected}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Status:
                                            </span> {returnRequest?.borrow_request?.status}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Notes:
                                            </span> {returnRequest?.borrow_request?.notes}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Borrower name:
                                            </span> {returnRequest?.borrow_request?.user?.username}
                                        </p>
                                        <p className="text-muted-foreground">
                                            <span className="text-black">
                                                Handled by:
                                            </span> {returnRequest?.borrow_request?.handler?.username}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-1 rounded-sm p-4">
                                <h4 className="text-lg">
                                    Return Request Details
                                </h4>
                                <Separator className={"my-4"} />
                                {returnRequest?.return_details ? (
                                    <ScrollArea className="max-h-64" >
                                        {returnRequest?.return_details?.map(detail => (
                                            <>
                                                <div className="border-1 rounded-xs p-2 my-2 flex gap-2">
                                                    <div className="size-16 border-1 p-1">
                                                        <img src={detail.item_unit?.item?.image_url} className="size-full object-contain" alt="" />
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex flex-col gap-1 justify-evenly">
                                                        <div>
                                                            <span className="text-black">Item: </span>
                                                            <span>{detail.item_unit?.item?.name} (<a className="underline" href={`/item-units/${detail.item_unit?.sku}`}>{detail.item_unit?.sku}</a>)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))}
                                    </ScrollArea>
                                ) : (
                                    <p className="text-sm text-muted-foreground">There is no borrow request details</p>
                                )}
                            </div>
                            <div className="border-1 rounded-sm p-4">
                                <h4 className="text-lg">
                                    Borrow Request Details
                                </h4>
                                <Separator className={"my-4"} />
                                {returnRequest?.borrow_request ? (
                                    <ScrollArea className="max-h-64" >
                                        {returnRequest?.borrow_request?.borrow_details?.map(detail => (
                                            <>
                                                <div className="border-1 rounded-xs p-2 my-2 flex gap-2">
                                                    <div className="size-16 border-1 p-1">
                                                        <img src={detail.item_unit?.item?.image_url} className="size-full object-contain" alt="" />
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex flex-col gap-1 justify-evenly">
                                                        <div>
                                                            <span className="text-black">Item: </span>
                                                            <span>{detail.item_unit?.item?.name} (<a className="underline" href={`/item-units/${detail.item_unit?.sku}`}>{detail.item_unit?.sku}</a>)</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-black">Quantity: </span>
                                                            <span>{detail.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))}
                                    </ScrollArea>
                                ) : (
                                    <p className="text-sm text-muted-foreground">There is no borrow request details</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}