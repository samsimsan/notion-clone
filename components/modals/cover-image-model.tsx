"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/singel-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { log } from "console";

export const CoverImageModal = () => {
    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const coverImage = useCoverImage();
    const { edgestore } = useEdgeStore();
    const params = useParams();
    const update = useMutation(api.documents.update);
    const updateCover = useMutation(api.documents.updateCover);

    const onClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose();
    }

    //This is to submit the cover image
    const onChange = async (file?: File) => {
        if (file) { // only do this if you have a file passed to this func
            setIsSubmitting(true);
            setFile(file);

            const res = await edgestore.publicFiles.upload({
                file
            });

            const oldCover = await updateCover({
                id: params.documentId as Id<"documents">,
                newCoverImage: res.url
            })

            if (oldCover !== undefined && oldCover !== null) {
                await edgestore.publicFiles.delete({
                    url: oldCover,
                });

            }

            onClose();
        };
    }

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">
                        Cover Image
                    </h2>
                </DialogHeader>
                <DialogHeader>
                    <SingleImageDropzone
                        className="w-full outline-none"
                        disabled={isSubmitting}
                        value={file}
                        onChange={onChange}
                    />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
