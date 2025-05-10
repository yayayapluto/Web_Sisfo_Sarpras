import React, {type ChangeEvent, useEffect, useState} from "react";
import {ArrowDownIcon, ArrowLeft, ArrowRight, ArrowUpIcon, Plus, RefreshCcw} from "lucide-react";
import { cn } from "~/lib/utils";
import { DataTable } from "~/components/ui/data-table";
import { CategoryColumn } from "~/components/columns/categoryColumn";
import {type Category} from "~/types/category";
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

type sortDirType = 'asc' | 'desc'
type sortByType = 'name' | 'created_at'

export default function CategoryIndex() {
    useProtectRoute()
    const [sortDir, setSortDir] = useState<sortDirType>("asc");
    const [sortBy, setSortBy] = useState<sortByType>("created_at");
    const [searchTerm, setSearchTerm] = useState<string>("");

    const baseUrl = import.meta.env.VITE_BASE_URL
    const [url, setUrl] = useState(`${baseUrl}/api/admin/categories`)
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
        const newUrl = `${baseUrl}/api/admin/categories?search=${searchTerm}&sortBy=${sortBy}&sortDir=${sortDir}`;
        setUrl(newUrl);
        setReload(true)
    }, [sortBy, sortDir, searchTerm]);

    const navigate = useNavigate()

    const [token] = useCookies("auth_token")
    const { isLoading, error, result } = useApi<PaginationResponse<Category>>({
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
        setReload(true)
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
                        <BreadcrumbPage>Categories</BreadcrumbPage>
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
                                    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
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

                    <Button className={cn("")} disabled={isLoading} onClick={() => navigate("/categories/create")}>
                        Add new
                        <Plus/>
                    </Button>
                </div>
            </div>

            {isLoading && (
                <Skeleton className={"w-full h-32 flex justify-center items-center"}>
                    <Spinner/>
                </Skeleton>
            )}
            {!error && !isLoading && result && <DataTable columns={CategoryColumn} data={result.data} />}

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