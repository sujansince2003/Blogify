import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyEditorProps {
  onChange: (content: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

const apiKey = import.meta.env.VITE_TinyMceapikey;
console.log(apiKey);
export default function TinyEditor({
  onChange,
  placeholder = "Enter the Content",
  defaultValue = "",
}: TinyEditorProps) {
  const editorRef = useRef(null);

  return (
    <>
      <Editor
        value={defaultValue}
        apiKey={apiKey}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          placeholder: placeholder || "Type your content here...",
        }}
        onEditorChange={onChange}
      />
    </>
  );
}
