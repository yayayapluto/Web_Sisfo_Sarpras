import { LoginForm } from "~/components/login-form";
import {useCookies} from "~/hooks/use-cookies";
import useApi from "~/hooks/use-api";
import {toast} from "sonner";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import type {User} from "~/types/user";



export default function Page() {
    const [getCookie] = useCookies("auth_token")

    const {isLoading, error, result} = useApi<User>({
        url: "http://localhost:8000/api/auth/self",
        headers: {
            Authorization: `Bearer ${getCookie ?? ""}`
        },
        trigger: !!getCookie,
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && result) {
            if (result.role === "admin") {
                toast("You're already logged in", { position: "top-center" });
                navigate("/dashboard", {
                    replace: true,
                    viewTransition: true
                });
            }
        }
    }, [isLoading, result]);

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="absolute inset-0 bg-[url('~/../bg_tb.webp')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 w-full max-w-sm max-h-svh sm:overflow-hidden">
                <LoginForm />
            </div>
        </div>
    );
}