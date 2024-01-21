import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils"; // to dynamically add classnames to tailwind elements

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"]
});

const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <Image
                src="/S-logo.svg"
                height={32}
                width={32}
                alt="logo"
                className="dark:hidden"
            />
            <Image
                src="/Notion.S Logo.png"
                height={32}
                width={32}
                alt="logo"
                className="hidden dark:block"
            />
            <p className={cn("font-semibold", font.className)}>
                Notion.S
            </p>
        </div>
    )
}

export default Logo