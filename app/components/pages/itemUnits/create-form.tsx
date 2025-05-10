import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import React from "react";
import {CreateItemForm} from "~/components/formHandlers/itemForms/createItemForm";
import {CreateItemUnitForm} from "~/components/formHandlers/itemUnitForms/createItemUnitForm";

export default function CreateItemUnit () {
    return (
        <div className="container mx-auto space-y-4 py-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/item-units">Item Units</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Create</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className={"border-1 rounded-sm p-4 lg:w-2/3"}>
                {/*<CreateItemForm/>*/}
                <CreateItemUnitForm/>
            </div>
        </div>
    )
}