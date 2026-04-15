import { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
};

export function RichTextEditor({ value, onChange, className }: Props) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  return (
    <div className={className}>
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} />
    </div>
  );
}
