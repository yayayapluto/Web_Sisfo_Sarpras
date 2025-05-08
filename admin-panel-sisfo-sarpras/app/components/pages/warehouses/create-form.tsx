import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import {CreateCategoryForm} from "~/components/formHandlers/categoryForms/createCategoryForm";
import React from "react";
import {CreateWarehouseForm} from "~/components/formHandlers/warehouseForms/createWarehouseForm";

export default function CreateCategory () {
    return (
        <div className="container mx-auto space-y-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/warehouses">Warehouse</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={"border-1 p-4 space-y-4"}>
                <CreateWarehouseForm/>
            </div>
        </div>
    )
}