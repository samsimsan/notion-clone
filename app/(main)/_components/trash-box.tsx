"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import ConfirmModal from "../../../components/modals/confirm-model";
import { Separator } from "@/components/ui/separator";
import { useEdgeStore } from "@/lib/edgestore";

const TrashBox = () => {

    const router = useRouter();
    const params = useParams();

    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const { edgestore } = useEdgeStore();

    const [search, setSearch] = useState("");
    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">
    ) => {
        event.stopPropagation();
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note."
        });
    };

    const onRemove = async (
        documentId: Id<"documents">
    ) => {

        // we first collect the cover url of the document
        const currentDoc = documents?.find(doc => doc._id === documentId);
        const coverImage = currentDoc?.coverImage;
        const content = currentDoc?.content;

        const findImageurls = (jsonObj: Object, baseurl: string) => {
            const result: string[] = [];
            const baseRegex = new RegExp(`${baseurl}`);

            //recursive function:
            const traverseObj = (obj: Object) => {
                if (typeof obj === "string" && baseRegex.test(obj)) {
                    result.push(obj);
                } else if (Array.isArray(obj)) {
                    obj.forEach(item => traverseObj(item));
                } else if (typeof obj === "object" && obj !== null) {
                    Object.values(obj).forEach(value => traverseObj(value));
                };
            };

            traverseObj(jsonObj);
            return result;
        }

        // then we check if it is undefined
        if (content || coverImage) {
            if (content) {
                const ImageInContent = findImageurls(JSON.parse(content), "files.edgestore");
                console.log("found " + ImageInContent.length + " images in content. Deleting now");
                for (const image of ImageInContent) {
                    await edgestore.publicFiles.delete({
                        url: image,
                    });
                };
                console.log("deleted Images");
            }
            if (coverImage) {
                // console.log("found cover and deleting it");
                await edgestore.publicFiles.delete({
                    url: coverImage,
                });
                // console.log("deleted cover");
            }
        }

        //if the user is looking at the doc that got deleted, he will be redirected
        if (params.documentId === documentId) {
            router.push("/documents");
        }
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note."
        });

    };

    const onRemoveAll = () => {
        filteredDocuments?.map((document) => {
            onRemove(document._id)
            return;
        })
    }

    //loading state
    if (documents === undefined) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Filter by page title..."
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-sm text-center text-muted-foreground pb-2">
                    No documents found.
                </p>
                {filteredDocuments?.map((document) => (
                    <div
                        key={document._id}
                        role="button"
                        onClick={() => onClick(document._id)}
                        className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                    >
                        <span className="truncate pl-2">
                            {document.title}
                        </span>
                        <div className="flex items-center" >
                            <div
                                onClick={(e) => onRestore(e, document._id)}
                                role="button"
                                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                            >
                                <Undo className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                <div
                                    role="button"
                                    className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                >
                                    <Trash className="h-4 w-4 text-muted-foreground" />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
                {filteredDocuments?.length !== 0 && (
                    <>
                        <Separator className="my-2" />
                        <ConfirmModal onConfirm={onRemoveAll}>
                            <div
                                className="px-2 py-1 text-center text-sm rounded-sm w-full dark:bg-primary/5 dark:hover:bg-neutral-800 hover:bg-primary/5 flex items-center justify-center text-primary"
                                role="button"
                            >
                                Clear trash
                            </div>
                        </ConfirmModal>
                    </>
                )}
            </div>
        </div >
    );
}

export default TrashBox