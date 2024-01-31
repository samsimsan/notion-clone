import { Loader } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority"; // we import from the class variance auth as we intend to create different variations of the spinner components (sizes)

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
    "text-muted-foreground animate-spin",
    {
        variants: {
            size: {
                default: "h-4 w-4",
                sm: "h-2 w-2",
                lg: "h-6 w-6",
                icon: "h-10 w-10"
            }
        },
        defaultVariants: {
            size: "default",
        },
    },
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> { }

export const Spinner = ({
    size,
}: SpinnerProps) => {
    return (
        <Loader className={cn(spinnerVariants({ size }))} />
    );
};


/* *****************************
WHAT I DID IN THIS COMPONENT:
* we imported the loader component from lucide react. But we needed to have it in various sizes
* So, we created our OWN component like the ones we have from shadcn and wrapped it around this loaded.

* The loader needs to take a prop "size", we created prefixed values for our ease.
* we used the cva and VariantProps to do this

  
 *******************************  */