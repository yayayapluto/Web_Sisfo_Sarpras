import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar"
import {cn} from "~/lib/utils";
import {Outlet, useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {Separator} from "~/components/ui/separator";
import {useCookies} from "~/hooks/use-cookies";
import useApi from "~/hooks/use-api";
import type {User} from "~/types/user";
import {toast} from "sonner";

export default function DashboardLayout() {


    return (
        <SidebarProvider>
            <AppSidebar />
            <main className={cn("w-full p-3")}>
                <SidebarTrigger />
                <div id="outlet-content" className={"px-2 pt-4 pb-2"}>
                    <Outlet/>
                </div>
            </main>
        </SidebarProvider>
    )
}