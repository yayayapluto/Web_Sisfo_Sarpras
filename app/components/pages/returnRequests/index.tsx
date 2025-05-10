import React, {type ChangeEvent, useEffect, useState} from "react";
import {ArrowDownIcon, ArrowLeft, ArrowRight, ArrowUpIcon, Plus, RefreshCcw} from "lucide-react";
import { cn } from "~/lib/utils";
import { DataTable } from "~/components/ui/data-table";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import {
    DropdownMenuRadioGroup,
    DropdownMenuSeparator
} from "@radix-ui/react-dropdown-menu";
import {capitalize} from "~/utils/string-formatter";
import { Input } from "~/components/ui/input"
import {Spinner} from "~/components/ui/spinner";
import useApi from "~/hooks/use-api";
import type {PaginationResponse} from "~/types/paginationResponse";
import { toast } from "sonner"
import {Skeleton} from "~/components/ui/skeleton";
import {useCookies} from "~/hooks/use-cookies";
import {useProtectRoute} from "~/hooks/use-protect-route";
import {Button} from "~/components/ui/button";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import {useNavigate} from "react-router";
import {WarehouseColumn} from "~/components/columns/warehouseColumn";
import type {Warehouse} from "~/types/warehouse";
import {ItemColumn} from "~/components/columns/itemColumn";
import type {Item} from "~/types/item";
import {itemUnitColumn} from "~/components/columns/itemUnitColumn";
import type {ItemUnit} from "~/types/itemUnit";
import type { BorrowRequest } from "~/types/borrowRequest";
import { BorrowRequestColumn } from "~/components/columns/borrowRequestColumn";
import type { ReturnRequest } from "~/types/returnRequest";
import { ReturnRequestColumn } from "~/components/columns/returnRequestColumn";

type sortDirType = 'asc' | 'desc'
type sortByType = 'status' | 'borrow_request_id' | 'created_at'
type statusType = 'available' | 'borrowed' | 'unknown' | 'none'

export default function BorrowRequestIndex() {
    useProtectRoute()
    const [sortDir, setSortDir] = useState<sortDirType>("asc");
    const [sortBy, setSortBy] = useState<sortByType>("created_at");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [status, setStatus] = useState<statusType>("none")

    const baseUrl = import.meta.env.VITE_BASE_URL
    const [url, setUrl] = useState(`${baseUrl}/api/admin/return-requests?with=handler,borrowRequest`)
    const [reload, setReload] = useState(false)

    useEffect(() => {
        setReload(true)
    }, [])

    useEffect(() => {
        if (reload) {
            setReload(false);
        }
    }, [reload]);

    useEffect(() => {
        const newUrl = `${baseUrl}/api/admin/return-requests?with=handler,borrowRequest&search=${searchTerm}&sortBy=${sortBy}&sortDir=${sortDir}`;
        setUrl(newUrl);
        setReload(true)
    }, [sortBy, sortDir, searchTerm]);

    const navigate = useNavigate()

    const [token] = useCookies("auth_token")
    const { isLoading, error, result } = useApi<PaginationResponse<ReturnRequest>>({
        url: url,
        headers: {
            Authorization: `Bearer ${token}`
        },
        trigger: reload
    });

    if (!isLoading && error !== null) {
        toast(error.toString())
    }

    const toggleSortDirection = () => {
        setSortDir(prevDir => (prevDir === "asc" ? "desc" : "asc"));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="container mx-auto py-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Return Requests</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col py-4 justify-between gap-5">
                <div className={"flex flex-col lg:flex-row gap-5"}>
                    <Input
                        placeholder="Search"
                        className="max-w-md min-w-44 text-sm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="flex flex-wrap justify-between lg:justify-start gap-2 items-center max-w-md">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={cn("flex justify-start")}>
                                    Sort by: {capitalize(sortBy)}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={sortBy} onValueChange={value => {
                                    setSortBy(value as sortByType)
                                }}>
                                    <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="borrow_request_id">Borrow Request</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="created_at">Created at</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline" onClick={toggleSortDirection} className={cn("flex justify-between")}>
                            {capitalize(sortDir)}
                            {sortDir === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        </Button>
                    </div>
                </div>
                <div className={"flex flex-row gap-2"}>
                    <Button variant={"outline"} onClick={() => setReload(true)} disabled={isLoading}>
                        Reload
                        <RefreshCcw className={`${isLoading && "animate-spin"}`}/>
                    </Button>
                </div>
            </div>

            {isLoading && (
                <Skeleton className={"w-full h-32 flex justify-center items-center"}>
                    <Spinner/>
                </Skeleton>
            )}
            {!error && !isLoading && result && <DataTable columns={ReturnRequestColumn} data={result.data} />}

            <div className="flex items-center justify-start space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={result?.prev_page_url === null || isLoading}
                    onClick={() => {
                        setUrl(result?.prev_page_url!)
                        setReload(true)
                    }}
                >
                    <ArrowLeft/>
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={result?.next_page_url === null || isLoading}
                    onClick={() => {
                        setUrl(result?.next_page_url!)
                        setReload(true)
                    }}
                >
                    Next
                    <ArrowRight/>
                </Button>
            </div>
        </div>
    );
}