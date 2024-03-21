import type { FC } from "react";

import Highlight from "@tiptap/extension-highlight";

import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MarkdownToolbar from "./markdown-toolbar";

type MarkdownEditorProps = {
  description: string | undefined;
  onChange: (value: string) => void;
};

const MarkdownEditor: FC<MarkdownEditorProps> = ({ description, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography],
    // extensions: [
    //   // Color.configure({ types: [TextStyle.name, ListItem.name] }),
    //   TextStyle.configure({
    //     HTMLAttributes: {
    //       types: [ListItem.name, BulletList.name],
    //     },
    //   }),

    //   BulletList.configure({
    //     HTMLAttributes: {
    //       class: "list-decimal ",
    //     },
    //   }),
    //   // StarterKit.configure({
    //   //   bulletList: {
    //   //     HTMLAttributes:{
    //   //       class:""
    //   //     }
    //   //     keepMarks: true,
    //   //     keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    //   //   },
    //   //   orderedList: {
    //   //     keepMarks: true,
    //   //     keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    //   //   },
    //   // }),

    //   // Heading.configure({
    //   //   HTMLAttributes: {
    //   //     class: "text-xl font-bold ",
    //   //     levels: [2],
    //   //   },
    //   // }),

    //   Document,
    //   Paragraph,
    //   Text,
    //   BulletList,
    //   ListItem,
    //   Heading,
    // ],
    content: description,
    editorProps: {
      attributes: {
        class: `prose !max-w-full prose-p:my-0 prose-zinc flex min-h-[250px] w-full  mt-2 rounded-md border border-input bg-background  py-2   ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-col focus:outline-none`,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML().replace(/<p><\/p>/g, "<br/>"));
    },
  });

  return (
    <div className="flex min-h-[250px] w-full flex-col">
      <MarkdownToolbar editor={editor} />
      <EditorContent editor={editor} className="" />
    </div>
  );
};

export default MarkdownEditor;
