"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";


const Error = () => {
    return (
        <div className="flex items-center justify-center h-full w-full flex-col gap-4">
            <Image
                src="/404.png"
                alt="404"
                height={128}
                width={128}
                className="dark:hidden block"
            />
            <Image
                src="/404 dark.png"
                alt="404"
                height={128}
                width={128}
                className="hidden dark:block"
            />
            <h2 className=" font-medium">
                Something went wrong!
            </h2>
            <Button asChild>
                <Link
                    href="/documents"
                >Go Back</Link>
            </Button>
        </div>
    )
}

export default Error