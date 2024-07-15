"use client";

import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine";
import { PartialBlock } from "@blocknote/core";
import "@blocknote/mantine/style.css";


import { useTheme } from 'next-themes';
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
    editable?: boolean,
    onChange: (content: string) => void,
    initialContent?: string
}



const Editor = ({
    editable,
    onChange,
    initialContent
}: EditorProps) => {

    const { resolvedTheme } = useTheme();
    const { edgestore } = useEdgeStore();

    const handleUpload = async (file: File) => {
        const response = await edgestore.publicFiles.upload({
            file
        });

        return response.url;
    }

    const editor = useCreateBlockNote({
        initialContent:
            initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile: handleUpload
    });

    return (
        <div>
            <BlockNoteView
                editor={editor}
                editable={editable}
                theme={resolvedTheme === "dark" ? "dark" : "light"}
                onSelectionChange={() => {
                    onChange(JSON.stringify(editor.document, null, 2));

                }}
            />
        </div>
    )
}

export default Editor