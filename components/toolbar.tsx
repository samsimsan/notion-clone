"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import React, { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolbarProps {
    initialData: Doc<"documents">;
    preview?: boolean;
};

const Toolbar = ({
    initialData,
    preview
}: ToolbarProps) => {

    const inputRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialData.title);
    const coverImage = useCoverImage();

    const update = useMutation(api.documents.update);
    const removeIcon = useMutation(api.documents.removeIcon);

    const enableInput = () => {
        if (preview) {
            return;
        }

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
        }, 0);
    };

    const disableInput = () => setIsEditing(false);

    const onInput = (value: string) => {
        setValue(value);
        update({
            id: initialData._id,
            title: value || "Untitled"
        });
    };

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (event.key === "Enter") {
            event.preventDefault();
            disableInput();
        };
    };


    //to add the icon to the document
    const onIconSelect = (icon: string) => {
        update({
            id: initialData._id,
            icon
        });
    };

    //to remove the icon from the document
    const onRemoveIcon = () => {
        removeIcon({
            id: initialData._id
        });
    };


    return (
        <div className="pl-[54px] group relative">
            {!!initialData.icon && !preview && ( // we HAVE the icon and its not in preview -> we can see and remove icon
                <div className="flex items-center gap-x-2 group/icon mt-[-16px]">
                    <IconPicker onChange={onIconSelect}>
                        <p className="text-6xl  hover:opacity-75 transition">
                            {initialData.icon}
                        </p>
                    </IconPicker>
                    <Button
                        onClick={onRemoveIcon}
                        className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
                        variant="outline"
                        size="icon"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            {!!initialData.icon && preview && (
                <p className="text-6xl pt-6">
                    {initialData.icon}
                </p>
            )}
            <div className="opacity-0 transition group-hover:opacity-100 flex items-center gap-x-1 py-3">
                {!initialData.icon && !preview && (  //we DON'T HAVE ICON and its not preview -> we can set the icon
                    <IconPicker asChild onChange={onIconSelect}>
                        <Button
                            className="text-muted-foreground text-xs"
                            variant="outline"
                            size="sm"
                        >
                            <Smile className="h-4 w-4 m-2" />
                            Add icon
                        </Button>
                    </IconPicker>
                )}
                {!initialData.coverImage && !preview && (
                    <Button
                        onClick={coverImage.onOpen}
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add cover
                    </Button>
                )}
            </div>
            {isEditing && !preview ? (
                <TextareaAutosize
                    ref={inputRef}
                    onBlur={disableInput}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
                />
            ) : (
                <div
                    onClick={enableInput}
                    className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
                >
                    {initialData.title}
                </div>
            )}
        </div>
    )
}

export default Toolbar