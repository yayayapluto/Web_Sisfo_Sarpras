import {useProtectRoute} from "~/hooks/use-protect-route";

export default function Dashboard() {
    useProtectRoute()
    return(
        <div className="container mx-auto">
            <h1 className="text-3xl">Dashboard</h1>
            <div className="flex items-center py-4 gap-2">
                <p>nanti tak kerjain</p>
            </div>
        </div>
    )
}