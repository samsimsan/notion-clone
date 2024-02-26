"use client";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

interface ItemProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: String;
    onClick: () => void;
    icon: LucideIcon;
}

const Item = ({
    id,
    label,
    onClick,
    icon: Icon,  // if we rename it to 'I'con, we can use it as jsx element
    active,
    documentIcon,
    isSearch,
    level = 0,
    onExpand,
    expanded,
}: ItemProps) => {

    const ChevronIcon = expanded ? ChevronDown : ChevronRight


    return (
        <div
            onClick={onClick}
            role="button"
            style={{
                paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
            }} // we did this instead cuz of the the below reason 1.
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary"
            )}
        >
            {/* adding !! to id allowes us to use it as a boolean */}
            {!!id && (
                <div
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
                    onClick={() => { }}
                >
                    <ChevronIcon
                        className="h-4 w-4 shrink-0 text-muted-foreground/50"
                    />
                </div>
            )}
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}
                </div>
            ) : (
                <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    Ctrl K
                </kbd>
            )}
        </div>
    )
}

export default Item

/*                 --------------
1.  this component will be used by all documents. 
    each doc can be a child doc to another, so to indicate that we would need to 'push' the child doc
    a bit to the left.
    To do this, we can directly modify the paddingleft if we have a reference to that doc and its style

                   -------------- */