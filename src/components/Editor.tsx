import React, { useEffect, useRef } from "react";
// Editor.js and its tools often have ESM/CJS compatibility issues
import _EditorJS from "@editorjs/editorjs";
import _Header from "@editorjs/header";
import _ImageTool from "@editorjs/image";
import _List from "@editorjs/list";
import _Quote from "@editorjs/quote";
import _Marker from "@editorjs/marker";
import _InlineCode from "@editorjs/inline-code";
import _Checklist from "@editorjs/checklist";
import _Embed from "@editorjs/embed";
import _Table from "@editorjs/table";
import _LinkTool from "@editorjs/link";
import _RawTool from "@editorjs/raw";
import _CodeTool from "@editorjs/code";
import _Delimiter from "@editorjs/delimiter";
import _Underline from "@editorjs/underline";

// Helper to get the actual class from the module
const getTool = (module: any) => (module && module.default) ? module.default : module;

const EditorJS = getTool(_EditorJS);
const Header = getTool(_Header);
const ImageTool = getTool(_ImageTool);
const List = getTool(_List);
const Quote = getTool(_Quote);
const Marker = getTool(_Marker);
const InlineCode = getTool(_InlineCode);
const Checklist = getTool(_Checklist);
const Embed = getTool(_Embed);
const Table = getTool(_Table);
const LinkTool = getTool(_LinkTool);
const RawTool = getTool(_RawTool);
const CodeTool = getTool(_CodeTool);
const Delimiter = getTool(_Delimiter);
const Underline = getTool(_Underline);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BASE_URL || "http://localhost:5000";

import ComparisonTool from "./ComparisonTool";
import SimpleVideo from "./SimpleVideo";
import SimpleAudio from "./SimpleAudio";
import TwitterEmbed from "./TwitterEmbed";
import YoutubeEmbed from "./YoutubeEmbed";
import FacebookEmbed from "./FacebookEmbed";

interface EditorProps {
  data?: any;
  onChange?: (data: any) => void;
  holder?: string;
}

const Editor: React.FC<EditorProps> = ({
  data,
  onChange,
  holder = "editorjs",
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const isInitializedRef = useRef(false);

  // Use a ref for onChange to avoid re-initializing editor when it changes
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      if (isInitializedRef.current || !isMounted) return;

      try {
        const editor = new EditorJS({
          holder: holder,
          data: data && typeof data === 'object' ? data : undefined,
          onReady: () => {
            if (isMounted) {
              isInitializedRef.current = true;
            }
          },
          onChange: async (api) => {
            const savedData = await api.saver.save();
            if (onChangeRef.current) {
              onChangeRef.current(savedData);
            }
          },
          tools: {
            header: Header,
            list: List,
            checklist: Checklist,
            embed: Embed,
            table: Table,
            link: LinkTool,
            raw: RawTool,
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  async uploadByFile(file: File) {
                    const formData = new FormData();
                    formData.append("image", file);
                    const token = localStorage.getItem("accessToken");
                    const res = await fetch(`${API_BASE_URL}/images`, {
                      method: "POST",
                      headers: token ? { "Authorization": `Bearer ${token}` } : {},
                      body: formData,
                    });
                    const responseData = await res.json();
                    if (responseData.success) {
                      return {
                        success: 1,
                        file: { url: responseData.data.url }
                      };
                    }
                    return { success: 0 };
                  },
                },
              },
            },
            quote: Quote,
            marker: Marker,
            inlineCode: InlineCode,
            code: CodeTool,
            delimiter: Delimiter,
            underline: Underline,
            // Custom tools
            comparison: ComparisonTool,
            video: SimpleVideo,
            audio: SimpleAudio,
            twitter: TwitterEmbed,
            youtube: YoutubeEmbed,
            facebook: FacebookEmbed,
          },
        });

        editorRef.current = editor;
      } catch (err) {
        console.error("Editor initialization error:", err);
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.isReady.then(() => {
          if (editorRef.current) {
            editorRef.current.destroy();
            editorRef.current = null;
            isInitializedRef.current = false;
          }
        }).catch(e => console.warn("Editor cleanup error:", e));
      }
    };
  }, [holder]);

  return (
    <div className="editor-container" style={{ minHeight: '300px' }}>
      <div id={holder} className="prose max-w-none dark:prose-invert" />
    </div>
  );
};

export default Editor;

