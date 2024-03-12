"use client";

import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react"; //refer below 2.
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { UserItem } from "./user-item";
import Item from "./Item";
import DocumentList from "./document-list";
import TrashBox from "./trash-box";

const Navigation = () => {

    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const create = useMutation(api.documents.create);

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile); //if the screen is mobile, it is collapsed, if not, we can change this to collapse sidebar

    // there seemed to be something that was marking the isMobile false in the begining which was taken by isCollapsed, the ismobile correct itself later but the isCollapsed needs to have a set method called to change it. This is the reason we call its set method in this effect.
    useEffect(() => {
        setIsCollapsed(isMobile);

        if (isMobile) {
            collapse(); //if we are in mobile screen, collapse the sidebar
        } else {
            resetWidth();
        }

    }, [isMobile])

    useEffect(() => {
        if (isMobile) {
            collapse();
        }
    }, [pathname, isMobile])

    const handleMouseDown = (   // for when we are trying to resize the sidebar
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);    // used to resize the sidebar
        document.addEventListener("mouseup", handleMouseUp);        // this is for when we release the mouse btn, signifying that we are done resizing
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = event.clientX;

        // how much they can increase and collapse the sidebar
        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`)
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp);
    }

    const resetWidth = () => { //to reset the sidebar width to its original width
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
            setTimeout(() => setIsResetting(false), 300);  // this is to give the navbar and the sidebar time for its transition of 300ms
        }
    }

    const collapse = () => { //to collapse the sidebar completely
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0");
            setTimeout(() => {
                setIsResetting(false);
            }, 300);
        }
    }

    const handleCreate = () => { // it will create a new page when you click on the 'new item' button
        const promise = create({ title: "Untitled" });
        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note."
        });
    };

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )} //refer below 1.
            >
                <div
                    role="button"
                    onClick={collapse}
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsLeft className="h-6 w-6" />
                </div>
                <div>
                    <UserItem />  {/* this is the user's face and name btw */}
                    <Item
                        label="Search"
                        icon={Search}
                        isSearch
                        onClick={() => { }}
                    />
                    <Item
                        label="Settings"
                        icon={Settings}
                        onClick={() => { }}
                    />
                    <Item
                        onClick={handleCreate}
                        label="New page"
                        icon={PlusCircle}
                    />
                </div>
                <div className="mt-4">
                    <DocumentList />
                    <Item       // to create new note. this is also to avoid the no pages message 
                        onClick={handleCreate}
                        icon={Plus}
                        label="Add a page"
                    />
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Trash" icon={Trash} />
                        </PopoverTrigger>
                        <PopoverContent
                            side={isMobile ? "bottom" : "right"}
                            className="p-0 w-72"
                        >
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[99999] left -60 w-[calc(100%-240px)]",  //this is to keep the navbar in sync with the collapsment of the sidebar. 
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full"
                )}
            >
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && (<MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />)}
                </nav>
            </div>
        </>
    )
}

export default Navigation

/*                                                     ***************************
----------------------
1. the "group" concept in tailwind:
    refer: https://youtu.be/0OaDyjB9Ib8?si=P4Uk653uMAIsPTuD&t=6725
    
    the aside element has a class "group" assigned to it.
    when we hover over the element with that class, then the element which has the class "group-hover:opacity-100" will have its opacity set to 100.
    
    This means that we can use this concept as a condition rendering on the elements with "group-" based on the condition of the element with "group" or "group/xyz"

    the "xyz" is used to differentiate the types.
----------------------
2. the ElementRef in react:
    Gets the instance type for a React element. The instance will be different for various component types.
    JSX intrinsics like div will give you their DOM instance. For React.ElementRef<"div"> that would be HTMLDivElement.

                                                      ****************************/