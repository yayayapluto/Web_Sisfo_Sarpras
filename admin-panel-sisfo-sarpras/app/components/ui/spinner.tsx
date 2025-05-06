import { Loader2 } from "lucide-react";
import React from "react";

export function Spinner({text = "Loading", isWhite = false}) {
    return (
        <div className={`flex items-center justify-center ${isWhite ? "text-white/70" : "text-black/70"}`}>
            <Loader2 className="animate-spin size-4 mr-2" />
            {text ?? "Loading"}
        </div>
    );
}