import React, {type ChangeEvent, useEffect, useState} from "react";
import { Button } from "../ui/button";
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
import {capitalize, makeDash} from "~/utils/string-formatter";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {Textarea} from "~/components/ui/textarea";
import {Spinner} from "~/components/ui/spinner";
import useApi from "~/hooks/use-api";
import type {PaginationResponse} from "~/types/paginationResponse";
import { toast } from "sonner"
import {CreateCategoryForm} from "~/components/formHandlers/categoryForm";
import {Skeleton} from "~/components/ui/skeleton";
import {useCookies} from "~/hooks/use-cookies";
import {useProtectRoute} from "~/hooks/use-protect-route";

export default function Categories() {
    useProtectRoute()
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [sortBy, setSortBy] = useState<"name" | "created_at">("created_at");
    const [withRel, setWithRel] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [url, setUrl] = useState("http://localhost:8000/api/admin/categories")
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
        const newUrl = `http://localhost:8000/api/admin/categories?search=${searchTerm}&sortBy=${sortBy}&sortDir=${sortDir}`;
        setUrl(newUrl);
    }, [sortBy, sortDir, searchTerm]);

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
        setReload(true)
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setReload(true)
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl">Categories</h1>
            <div className="flex flex-col py-4 justify-between gap-10">
                <div className={"flex flex-col gap-5"}>
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
                                    setSortBy(value as "name" | "created_at")
                                    setReload(true)
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">With: {withRel.toString()}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Available relations</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem
                                    checked={withRel.includes("items")}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setWithRel(prev => [...prev, "items"]);
                                        } else {
                                            setWithRel(prev => prev.filter(w => w !== "items"));
                                        }
                                        setReload(true)
                                    }}
                                >
                                    Items
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className={"flex flex-row gap-2"}>
                    <Button variant={"outline"} onClick={() => setReload(true)} disabled={isLoading}>
                        Reload
                        <RefreshCcw className={`${isLoading && "animate-spin"}`}/>
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className={cn("bg-tb hover:bg-tb-sec")} disabled={isLoading}>
                                Add new
                                <Plus/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create new category</DialogTitle>
                                <DialogDescription>
                                    Make sure you naming it properly
                                </DialogDescription>
                            </DialogHeader>
                            <CreateCategoryForm/>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {isLoading && (
                <Skeleton className={"w-full h-[571.5px] flex justify-center items-center"}>
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