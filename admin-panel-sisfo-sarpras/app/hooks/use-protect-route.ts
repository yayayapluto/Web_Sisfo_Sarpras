import { useCookies } from "~/hooks/use-cookies";
import { useEffect, useState } from "react";
import useApi from "~/hooks/use-api";
import type { User } from "~/types/user";
import { useNavigate } from "react-router"; // Ensure you are using react-router-dom
import { toast } from "sonner";

export const useProtectRoute = () => {
    const [authToken] = useCookies("auth_token");
    const [authCheck, setAuthCheck] = useState(false);

    const { isLoading, error, result } = useApi<User>({
        url: "http://localhost:8000/api/auth/self",
        headers: {
            Authorization: `Bearer ${authToken ?? ""}`,
        },
        trigger: authCheck,
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Trigger the API call by setting authCheck to true
        setAuthCheck(true);
    }, []);

    useEffect(() => {
        if (!isLoading && result && result.role === "admin") {
            return;
        }

        if (error) {
            toast.error("You're not authorized", { position: "top-center" });
            navigate("/", {
                replace: true,
                viewTransition: true,
            });
        }
    }, [isLoading, error, result, authCheck, navigate]);
};