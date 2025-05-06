import { LoginForm } from "~/components/login-form";

export default function Page() {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center p-6 md:p-10">
            <div className="absolute inset-0 bg-[url('bg_tb.webp')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 w-full max-w-sm max-h-svh sm:overflow-hidden">
                <LoginForm />
            </div>
        </div>
    );
}