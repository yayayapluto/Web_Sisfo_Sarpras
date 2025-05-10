import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
    SidebarMenu, SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar"

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


import {
    Calendar,
    Home,
    Inbox,
    Search,
    Settings,
    User,
    PlusCircle,
    List,
    Box,
    Archive,
    LayoutDashboardIcon,
    MoreVerticalIcon,
    UserCircleIcon, CreditCardIcon, BellIcon, LogOutIcon, UserRound, UserRoundIcon, MoreVertical
} from "lucide-react";
import {cn} from "~/lib/utils";
import {Separator} from "~/components/ui/separator";
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {Button} from "~/components/ui/button";
import {useNavigate} from "react-router";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "~/components/ui/dialog";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {makeDash} from "~/utils/string-formatter";
import {Textarea} from "~/components/ui/textarea";
import {Spinner} from "~/components/ui/spinner";
import {useState} from "react";
import {useCookies} from "~/hooks/use-cookies";

const adminMenuItems = [
    {
        groupLabel: "Master Data",
        icon: Settings,
        items: [
            {
                title: "Users",
                url: "/users",
                icon: User,
            },
            {
                title: "Categories",
                url: "/categories",
                icon: List,
            },
            {
                title: "Warehouses",
                url: "/warehouses",
                icon: Box,
            },
        ],
    },
    {
        groupLabel: "Items",
        icon: Inbox,
        items: [
            {
                title: "List Items",
                url: "/items",
                icon: Archive,
            },
        ],
    },
    {
        groupLabel: "Item Units",
        icon: Inbox,
        items: [
            {
                title: "List Item Units",
                url: "/item-units",
                icon: List,
            },
        ],
    },
    {
        groupLabel: "Requests",
        icon: Calendar,
        items: [
            {
                title: "Borrow Requests",
                url: "/borrow-requests",
                icon: PlusCircle,
            },
            {
                title: "Return Requests",
                url: "/return-requests",
                icon: Calendar,
            },
        ],
    },
    {
        groupLabel: "System",
        icon: Search,
        items: [
            {
                title: "Logs",
                url: "/logs",
                icon: Search,
            },
        ],
    },
];


export function AppSidebar() {
    const navigate = useNavigate()
    const [getCookie, setCookie, removeCookie] = useCookies("auth_token")

    const logoutBtnHandler = () => {
        console.log("Cookie will be removed: ", getCookie)
        removeCookie()
        navigate("/", {
            replace: true,
            viewTransition: true
        })
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <span className={"flex items-center font-medium"}>
                            <img src={"https://portal.smktarunabhakti.net/pluginfile.php/1/core_admin/logo/0x150/1745293129/download.jpg"} alt={"Logo SMK Taruna Bhakti"} className={cn("size-12")}/>
                            Sisfo sarpras
                        </span>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <Separator/>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/dashboard" className={"flex"}>
                                        <LayoutDashboardIcon/>
                                        <span>Dashboard</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {adminMenuItems.map((group) => (
                    <SidebarGroup key={group.groupLabel}>
                        <SidebarGroupLabel>
                            {group.groupLabel}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <Separator/>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <UserRoundIcon/>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">Admin</span>
                                    </div>
                                    <MoreVerticalIcon className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side={"top"}
                                align="center"
                                sideOffset={4}
                            >
                                <DropdownMenuItem className={"p-0"}>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                className={"w-full"}
                                                variant={"outline"}
                                                onClick={(event) => event.stopPropagation()}
                                            >
                                                <LogOutIcon />
                                                Log out
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Are you sure wants to logout?</DialogTitle>
                                                <DialogDescription>
                                                    This action cant be undo, you must be login after this.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <>
                                                    <Button variant={"outline"} onClick={logoutBtnHandler}>
                                                        Yes, log out
                                                    </Button>
                                                    <Button className={cn("")}>
                                                        No, i'll stay
                                                    </Button>
                                                </>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}