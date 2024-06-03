"use client";


import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";


interface EditorProps {
    onChange: () => void;
    initialContent?: string
    editable?: boolean
}


const Editor = ({
    onChange,
    initialContent,
    editable
}: EditorProps) => {

    const editor = useCreateBlockNote({
        initialContent: [
            {
              type: "paragraph",
              content: "Welcome to this demo!",
            },
        ]
    });

    return (
        <BlockNoteView editor={editor} />
    )
}

export default Editor