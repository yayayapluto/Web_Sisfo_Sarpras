import type { ColumnDef } from "@tanstack/react-table";
import {useNavigate} from "react-router";
import {Button} from "~/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";
import type {Warehouse} from "~/types/warehouse";
import type { Log } from "~/types/log";


export const LogColumn: ColumnDef<Log>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "entity",
        header: "Entity",
    },
    {
        accessorKey: "entity_id",
        header: "Entity id",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "ip_address",
        header: "Ip Address",
    },
    {
        accessorKey: "user_agent",
        header: "User Agent",
    },
    {
        accessorKey: "performer.username",
        header: "Performed By",
        cell: ({row}) => row.original.performer ?? "Seeder"
    },
    {
        accessorKey: "created_at",
        header: "Created at"
    },
    {
        accessorKey: "updated_at",
        header: "Updated at"
    },
    {
        header: "Action",
        cell: ({ row }) => {
            const log = row.original;
            const navigate = useNavigate()

            return (
                <Button variant={"outline"} onClick={() => {
                    navigate(`/logs/${log.id}`)
                }}>
                    <SquareArrowOutUpRight/>
                </Button>
            );
        }
    }
];