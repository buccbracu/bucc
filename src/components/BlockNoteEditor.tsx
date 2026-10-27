"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface BlockNoteEditorProps {
  initialValue?: any;
  onChange?: (content: any) => void;
  editable?: boolean;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
}

export default function BlockNoteEditor({ 
  initialValue, 
  onChange, 
  editable = true, 
  minHeight = "200px",
  maxHeight,
  className = ""
}: BlockNoteEditorProps) {
  const { resolvedTheme } = useTheme();

  // Initialize the editor
  const editor = useCreateBlockNote({
    initialContent: initialValue && initialValue.length > 0 ? initialValue : undefined,
    uploadFile: async () => {
      toast.error("Direct file uploads are disabled. Please use the 'Embed Image' tab / URL option.");
      throw new Error("Direct file uploads are disabled.");
    }
  });

  return (
    <div 
      className={`${editable ? "border border-border rounded-md bg-background py-3 sm:py-4 transition-all" : "py-2 bg-transparent"} ${maxHeight ? "overflow-y-auto" : "overflow-hidden"} ${className}`} 
      style={{ 
        minHeight: editable ? minHeight : "auto",
        maxHeight: maxHeight || undefined
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        /* Mobile responsive editor padding */
        @media (max-width: 640px) {
          .bn-container .bn-editor {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }

        /* Hide upload tab button in BlockNote panels */
        .mantine-Tabs-tab[value="upload"],
        [role="tab"][value="upload"],
        button[value="upload"],
        .bn-file-panel-tab[data-tab="upload"],
        [data-tab="upload"],
        .mantine-Tabs-tabList > button:first-of-type,
        [role="tablist"] > button:first-of-type {
          display: none !important;
        }

        /* Hide upload panel content */
        .mantine-Tabs-panel[value="upload"],
        [role="tabpanel"][value="upload"],
        [data-tab-panel="upload"] {
          display: none !important;
        }

        /* Force embed panel content to show */
        .mantine-Tabs-panel[value="embed"],
        [role="tabpanel"][value="embed"],
        [data-tab-panel="embed"] {
          display: block !important;
        }
      ` }} />
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
        onChange={() => {
          if (onChange) {
            onChange(editor.document);
          }
        }}
      />
    </div>
  );
}
