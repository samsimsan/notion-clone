"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";


interface CoverImageProps {
    url?: string;
    preview?: boolean;
    initialData: Doc<"documents">;
}

const Cover = ({
    url,
    preview,
    initialData
}: CoverImageProps) => {

    const coverImage = useCoverImage();
    const { edgestore } = useEdgeStore();
    const removeCoverImage = useMutation(api.documents.removeCover);
    const updateCoverImage = useMutation(api.documents.updateCover);
    const params = useParams();

    //Removing coverImage
    const RemoveCover = async () => {
        if (initialData.coverImage) {
            await edgestore.publicFiles.delete({
                url: initialData.coverImage,
            });
            // removeCoverImage({
            //     id: params.documentId as Id<"documents">
            // });
            updateCoverImage({
                id: params.documentId as Id<"documents">,
                newCoverImage: undefined
            })

        } else {
            console.log("No previous cover image found for this Doc");

        }

    }


    return (
        <div className={cn(
            "relative w-full h-[35vh] group",
            !url && "h-[12vh]",
            url && "bg-muted"
        )}
        >
            {!!url && (
                <Image
                    src={url}
                    fill
                    alt="Cover"
                    className="object-cover"
                />
            )}
            {!!url && !preview && (
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                    <Button
                        onClick={() => {
                            // RemoveCover();
                            coverImage.onOpen();
                        }}
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Change cover
                    </Button>
                    <Button
                        onClick={RemoveCover}
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Cover