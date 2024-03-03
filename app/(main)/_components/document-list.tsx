"use client";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Item from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListPorps {
    parentDocumentId?: Id<"documents">;
    level?: number;
    data?: Doc<"documents">[];

}

const DocumentList = ({
    parentDocumentId,
    level = 0,
}: DocumentListPorps) => {

    const params = useParams();
    const router = useRouter();

    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const onExpand = (documemtId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documemtId]: !prevExpanded[documemtId]
        }));
    };

    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId
    });

    const onRedirect = (documentId: string) => {  //this redirects to the document
        router.push(`/documents/${documentId}`);
    };

    if (documents === undefined) {  //the return from convex is undefined only when it is loading
        return (
            <>
                <Item.Skeleton level={level} />
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level} />
                        <Item.Skeleton level={level} />
                    </>
                )}
            </>
        );
    };

    return (
        <>
            <p      // if this is the only element in this entire frag, it means there are no other docs rendered so - no pages inside. if its not the last element its going to be hidden
                style={{
                    paddingLeft: level ? `${(level * 12) + 25}px` : undefined
                }}
                className={cn(
                    "hidden tex-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No pages inside
            </p>
            {/* rendering the documents */}
            {documents.map((document) => (
                <div key={document._id}>
                    <Item
                        id={document._id}
                        onClick={() => onRedirect(document._id)}    // on click, the doc should be shown
                        label={document.title}  // will be the name of the doc
                        icon={FileIcon}         // this is the default icon shown 
                        documentIcon={document.icon}                // if it has that then show this icon
                        active={params.documemtId === document._id} // while mapping you see the document whose id matches then one displayed, make it active
                        level={level}           // level of the doc
                        onExpand={() => onExpand(document._id)}     // to change the expand state
                        expanded={expanded[document._id]}           // the state for expanded
                    />
                    {/* recursion for child components: */}
                    {/* if the expanded state holds the doc id, only then we'll re render this comp for the child docs */}
                    {expanded[document._id] && (
                        <DocumentList
                            parentDocumentId={document._id}
                            level={level + 1}
                        />
                    )}
                </div>
            ))}
        </>
    );
};

export default DocumentList