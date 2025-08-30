"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Jodit Editor to avoid SSR issues
const JoditEditorComponent = dynamic(
  () => import("jodit-react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-60 border rounded p-4 bg-gray-50">
        Loading editor...
      </div>
    ),
  }
);

export const JoditEditor = ({ value, onChange }) => {
  const editor = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clear editor when value is empty
  useEffect(() => {
    if (editor.current && value === "") {
      editor.current.value = "";
    }
  }, [value]);

  // const config = {
  //   readonly: false,
  //   height: 120,
  //   placeholder: "Share your thoughts...",
  //   buttons: [
  //     "bold",
  //     "italic",
  //     "underline",
  //     "|",
  //     "ul",
  //     "ol",
  //     "|",
  //     "link",
  //     "image",
  //     "video",
  //     "|",
  //     "undo",
  //     "redo",
  //   ],
  //   removeButtons: [
  //     "source",
  //     "fullsize",
  //     "about",
  //     "outdent",
  //     "indent",
  //     "fontsize",
  //     "brush",
  //     "paragraph",
  //   ],
  //   toolbarAdaptive: false,
  //   showCharsCounter: false,
  //   showWordsCounter: false,
  //   showXPathInStatusbar: false,
  // };

  if (!isMounted) {
    return <div className="h-60 border rounded p-4 bg-gray-50"></div>;
  }

  return (
    <JoditEditorComponent
      ref={editor}
      // value={value} 
        value={undefined} 
      onBlur={(newContent) => onChange(newContent)} 
      onChange={(newContent) => onChange(newContent)}
    />
  );
};
