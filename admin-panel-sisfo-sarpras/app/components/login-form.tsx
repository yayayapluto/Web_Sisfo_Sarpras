import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import React, {useState} from "react";
import * as path from "node:path";
import {useNavigate} from "react-router";
import {Spinner} from "~/components/ui/spinner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard", {
        viewTransition: true
      });
    }, Math.floor(Math.random() * 1000 + 1000));
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className={"flex justify-center"}>
              <img src={"https://portal.smktarunabhakti.net/pluginfile.php/1/core_admin/logo/0x150/1745293129/download.jpg"} alt={"Logo SMK Taruna Bhakti"}/>
            </div>
            Sisfo Sarpras
          </CardTitle>
          <CardDescription>
            Sistem Informasi Sarana dan Prasarana Sekolah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="username"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="button" className="w-full bg-tb hover:bg-tb-sec hover:cursor-pointer" onClick={simulateLoading}>
                  {isLoading ? <Spinner text={"Logging in..."} isWhite/> : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <span className={"flex w-full justify-center"}>
            <p className={"text-black/50 text-sm text-center"}>Copyright 2025 SMK Taruna Bhakti</p>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
