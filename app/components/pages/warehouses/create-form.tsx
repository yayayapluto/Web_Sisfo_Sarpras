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
        <div className="container mx-auto space-y-4 py-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 py-4">
            <div className={"border-1 rounded-sm p-4 space-y-4"}>
                <CreateWarehouseForm/>
            </div>
            </div>
        </div>
    )
}