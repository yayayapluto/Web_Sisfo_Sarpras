import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar"
import {cn} from "~/lib/utils";
import {Outlet} from "react-router";
import {useEffect} from "react";
import {Separator} from "~/components/ui/separator";

export default function DashboardLayout() {
    useEffect(() => {
        console.log("rendered")
    }, [])
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