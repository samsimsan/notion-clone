"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/singel-image-dropzone";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const CoverImageModal = () => {
    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const coverImage = useCoverImage();
    const { edgestore } = useEdgeStore();
    const params = useParams();
    const update = useMutation(api.documents.update);

    const onClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose();
    }

    //This is to submit the cover image
    const onChange = async (file?: File) => {

        if (file) {
            setIsSubmitting(true);
            setFile(file);

            const res = await edgestore.publicFiles.upload({
                file,
                options: {
                    replaceTargetUrl: coverImage.url //if it has a value that will be used else it would be undefined so nothing would be there
                }
            });

            await update({
                id: params.documentId as Id<"documents">,
                coverImage: res.url
            });
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
