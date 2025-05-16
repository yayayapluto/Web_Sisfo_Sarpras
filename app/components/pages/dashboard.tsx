import { useProtectRoute } from "~/hooks/use-protect-route";
import useApi from "~/hooks/use-api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription, CardFooter,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Separator } from "~/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "~/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import React, { useEffect, useState } from "react";
import { useCookies } from "~/hooks/use-cookies";
import { Spinner } from "../ui/spinner";
import type {BorrowRequest} from "~/types/borrowRequest";
import type {ReturnRequest} from "~/types/returnRequest";
import type {PaginationResponse} from "~/types/paginationResponse";
import {cn} from "~/lib/utils";
import {Button} from "~/components/ui/button";
import {useNavigate} from "react-router";

const baseUrl = import.meta.env.VITE_BASE_URL

const API = {
  entityCounts: `${baseUrl}/api/admin/dashboard/entity-counts`,
  categoryDistribution: `${baseUrl}/api/admin/dashboard/category-distribution`,
  borrowReturnStats: `${baseUrl}/api/admin/dashboard/borrow-return-stats`,
  alerts: `${baseUrl}/api/admin/dashboard/alerts`,
};

type EntityCounts = {
  users: number;
  admins: number;
  warehouses: number;
  categories: number;
  items: number;
  item_units: number;
  borrow_requests: number;
  return_requests: number;
  consumable_items: number;
  non_consumable_items: number;
};

type CategoryItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  items_count: number;
};

type ItemUnitsPerCategory = {
  category: string;
  item_units: number;
};

type CategoryDistribution = {
  items_per_category: CategoryItem[];
  item_units_per_category: ItemUnitsPerCategory[];
};

type BorrowedVsReturned = {
  borrowed: number;
  returned: number;
};

type BorrowReturnStats = {
  borrow_over_time: any[];
  return_over_time: any[];
  top_borrowed: any[];
  current_borrowed: any[];
  borrowed_vs_returned: BorrowedVsReturned;
};

type WarehouseOverCapacity = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  [key: string]: any;
};

type LowStockItem = {
  id: number;
  sku: string;
  condition: string;
  notes: string | null;
  acquisition_source: string;
  acquisition_date: string;
  acquisition_notes: string | null;
  status: string;
  quantity: number;
  qr_image_url: string;
  item_id: number;
  warehouse_id: number;
  current_location: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  item?: { id: number; name: string };
};

type Alerts = {
  pending_borrow_requests: PaginationResponse<BorrowRequest>;
  pending_return_requests: PaginationResponse<ReturnRequest>;
};

export default function Dashboard() {
  useProtectRoute();

  const [doTrigger, setDoTrigger] = useState(true);

  const [token] = useCookies("auth_token")
  const entityCounts = useApi<EntityCounts>({ url: API.entityCounts, trigger: doTrigger, showToast: false, headers: { Authorization: `Bearer ${token}` } });
  const categoryDist = useApi<CategoryDistribution>({ url: API.categoryDistribution, trigger: doTrigger, showToast: false, headers: { Authorization: `Bearer ${token}` } });
  const borrowStats = useApi<BorrowReturnStats>({ url: API.borrowReturnStats, trigger: doTrigger, showToast: false, headers: { Authorization: `Bearer ${token}` } });
  const alerts = useApi<Alerts>({ url: API.alerts, trigger: doTrigger, showToast: false, headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    setDoTrigger(false)
  }, [doTrigger])

  setInterval(() => {
    setDoTrigger(true)
  }, 15000)

  const chartColors = [
    "#3b82f6",
    "#0ea5e9",
    "#64748b",
    "#06b6d4",
    "#6366f1",
    "#8b5cf6",
    "#6b7280",
  ];

  const entityList: Partial<EntityCounts> = entityCounts.result || {};
  const entityKeys = [
    { key: "users", label: "Users" },
    { key: "admins", label: "Admins" },
    { key: "warehouses", label: "Warehouses" },
    { key: "categories", label: "Categories" },
    { key: "items", label: "Items" },
    { key: "item_units", label: "Item Units" },
    { key: "borrow_requests", label: "Borrow Requests" },
    { key: "return_requests", label: "Return Requests" },
    { key: "consumable_items", label: "Consumable Items" },
    { key: "non_consumable_items", label: "Non-Consumable Items" },
  ];

  const itemsPerCategory: CategoryItem[] = categoryDist.result?.items_per_category || [];
  const itemUnitsPerCategory: ItemUnitsPerCategory[] = categoryDist.result?.item_units_per_category || [];

  const borrowedVsReturned: BorrowedVsReturned = borrowStats.result?.borrowed_vs_returned || { borrowed: 0, returned: 0 };

  const alertContent: Alerts = alerts.result!;
  const pendingBorrow = alertContent?.pending_borrow_requests;
  const pendingReturn = alertContent?.pending_return_requests;

  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-start gap-2">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <span>{entityCounts.isLoading && <Spinner text="" />}</span>
      </div>
      <div className="grid grid-cols-2   md:grid-cols-3 lg:grid-cols-5 gap-4">
        {entityCounts.isLoading
          ? Array.from({ length: 5 }).map((_, i: number) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          : entityKeys.slice(0, 5).map(({ key, label }) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle>{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entityList[key as keyof EntityCounts] ?? 0}</div>
                </CardContent>
              </Card>
            ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Items per Category</CardTitle>
            <CardDescription>Distribution of items by category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryDist.isLoading ? (
              <Skeleton className="h-56 w-full rounded-xl" />
            ) : (
              <ChartContainer
                config={Object.fromEntries(
                  itemsPerCategory.map((cat: CategoryItem, i: number) => [cat.name, { label: cat.name, color: chartColors[i % chartColors.length] }])
                )}
                className="min-h-[220px]"
              >
                <BarChart data={itemsPerCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="items_count">
                    {itemsPerCategory.map((_, i: number) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Bar>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Borrowed vs Returned</CardTitle>
            <CardDescription>Comparison of borrowed and returned items</CardDescription>
          </CardHeader>
          <CardContent>
            {borrowStats.isLoading ? (
              <Skeleton className="h-56 w-full rounded-xl" />
            ) : (
              <ChartContainer
                config={{
                  borrowed: { label: "Borrowed", color: chartColors[0] },
                  returned: { label: "Returned", color: chartColors[1] },
                }}
                className="min-h-[220px]"
              >
                <BarChart data={[borrowedVsReturned]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={() => "Total"} tick={false} />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="borrowed" fill={chartColors[0]} />
                  <Bar dataKey="returned" fill={chartColors[1]} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Borrow requests</CardTitle>
            <CardDescription>
              <Badge variant={pendingBorrow?.data.length > 0 ? "destructive" : "default"}>
                Pending Borrow Requests: {pendingBorrow?.data.length ?? 0}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className={cn("w-full")} >
            {alerts.isLoading ? (
                <Skeleton className="h-40 w-full rounded-xl" />
            ) : (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {pendingBorrow?.data.length <= 0 && (
                      <span className={"text-sm text-muted-foreground"} >There is no pending borrow request</span>
                  )}
                  {pendingBorrow?.data.length > 0 && pendingBorrow?.data.map(request => (
                      <Card>
                        <CardHeader>
                          <CardTitle>Requested by {request.user?.username}</CardTitle>
                          <CardDescription>Requested at {`${request.created_at.split("T")[0]} ${request.created_at.split("T")[1].split(".")[0]}`}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Total item requested: {request.borrow_details?.length}</p>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={() => navigate(`/borrow-requests/${request.id}`)} >
                            See detail
                          </Button>
                        </CardFooter>
                      </Card>
                  ))}
                </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Return Borrow requests</CardTitle>
            <CardDescription>
              <Badge variant={pendingReturn?.data.length > 0 ? "destructive" : "default"}>
                Pending Return Requests: {pendingReturn?.data.length ?? 0}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className={cn("w-full")} >
            {alerts.isLoading ? (
                <Skeleton className="h-40 w-full rounded-xl" />
            ) : (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {pendingReturn?.data.length <= 0 && (
                      <span className={"text-sm text-muted-foreground"} >There is no pending return request</span>
                  )}
                  {pendingReturn?.data.length > 0 && pendingReturn?.data.map(request => (
                      <Card>
                        <CardHeader>
                          <CardTitle>Requested by {request.borrow_request?.user?.username}</CardTitle>
                          <CardDescription>Requested at {`${request.created_at.split("T")[0]} ${request.created_at.split("T")[1].split(".")[0]}`}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button onClick={() => navigate(`/return-requests/${request.id}`)} >
                            See detail
                          </Button>
                        </CardFooter>
                      </Card>
                  ))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
