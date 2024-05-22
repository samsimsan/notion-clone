"use client";

import ConfirmModal from "@/components/modals/confirm-model";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
    documentId: Id<"documents">
    coverImage?: string
}

const Banner = ({
    documentId,
    coverImage
}: BannerProps) => {

    const router = useRouter();
    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);

    const { edgestore } = useEdgeStore();


    const onRemove = async () => {
        router.push("/documents");
        const promise = remove({ id: documentId })
        
        
        if (coverImage) {
            console.log("found cover and deleting it");
            await edgestore.publicFiles.delete({
                url: coverImage,
            });
            console.log("deleted cover");
        }
        
        
        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note."
        });

    };

    const onRestore = () => {
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note."
        });
    };

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p className="mr-6">
                This page is in Trash!
            </p>
            <Button
                size="sm"
                onClick={onRestore}
                variant="outline"
                className="border-white bg-tranparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore page
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button
                    size="sm"
                    variant="outline"
                    className="border-white bg-tranparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete forever
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default Banner