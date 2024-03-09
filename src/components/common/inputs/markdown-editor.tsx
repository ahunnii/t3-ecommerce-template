import type { FC } from "react";

import BulletList from "@tiptap/extension-bullet-list";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
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
        class: `prose prose-p:my-0 prose-zinc flex min-h-[150px] w-full  rounded-md border border-input bg-background px-3 py-2   ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-col  m-5 focus:outline-none`,
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
