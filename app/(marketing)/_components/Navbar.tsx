"use client";

import useScrollTop from "@/hooks/use-scrol-top";
import { ModeToggle } from "@/components/mode-toggle";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const Navbar = () => {

    const scrolled = useScrollTop(); // it returns a boolean which tells you if you scrolled beyound the threshold, 10px default

    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                <ModeToggle />
            </div>
        </div>
    )
}

export default Navbar