import type { FC } from "react";

import Heading from "@tiptap/extension-heading";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MarkdownToolbar from "./markdown-toolbar";
type MarkdownEditorProps = {
  description: string | undefined;
  onChange: (value: string) => void;
};

const MarkdownEditor: FC<MarkdownEditorProps> = ({ description, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold ",
          levels: [2],
        },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          "flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-col",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML().replace(/<p><\/p>/g, "<br/>"));
    },
  });

  return (
    <div className="flex min-h-[250px] flex-col justify-stretch">
      <MarkdownToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default MarkdownEditor;
