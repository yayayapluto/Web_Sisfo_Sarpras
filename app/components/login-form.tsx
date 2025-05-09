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
import {LoginFormZ} from "~/components/formHandlers/loginForm";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className={"flex justify-center"}>
              <img src={"~/../logo_tb.webp"} alt={"Logo SMK Taruna Bhakti"}/>
            </div>
            Sisfo Sarpras
          </CardTitle>
          <CardDescription>
            Sistem Informasi Sarana dan Prasarana Sekolah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginFormZ/>
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
