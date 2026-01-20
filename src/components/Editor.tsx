import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData, ToolConstructable, ToolSettings } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Paragraph from "@editorjs/paragraph";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
// Editor.js styles are included automatically in v2
// If styles are missing, they're bundled with the package

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BASE_URL || "http://localhost:5000";

// Custom tools (ensure these are properly typed in their respective files)
import SimpleVideo from "./SimpleVideo";
import SimpleAudio from "./SimpleAudio";
import TwitterEmbed from "./TwitterEmbed";
import YoutubeEmbed from "./YoutubeEmbed";
import FacebookEmbed from "./FacebookEmbed";

interface EditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  holder?: string;
}

const Editor: React.FC<EditorProps> = ({
  data,
  onChange,
  holder = "editorjs",
}) => {
  const editorRef = useRef<EditorJS | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  // Capture initial data only once - don't update when data prop changes
  const initialDataRef = useRef<OutputData | undefined>(data);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isMounted = true;

    const initEditor = async (): Promise<void> => {
      if (!isMounted || isInitializedRef.current) return;

      // Ensure any previous instance is destroyed before creating a new one
      if (editorRef.current) {
        try {
          if (typeof editorRef.current.destroy === 'function') {
            await editorRef.current.destroy();
          }
        } catch (error) {
          console.warn("Error destroying editor:", error);
        }
        editorRef.current = null;
      }

      try {
        // If no initial data, start with an empty paragraph block so users can type immediately
        const editorData = initialDataRef.current || {
          blocks: [
            {
              type: "paragraph",
              data: {
                text: "",
              },
            },
          ],
        };

        const editor = new EditorJS({
          holder: holder,
          autofocus: false,
          data: editorData,
          inlineToolbar: true, // Enable inline toolbar globally
          placeholder: "Start typing your text here...",

          tools: {
            paragraph: {
              class: Paragraph as unknown as ToolConstructable,
              inlineToolbar: ["bold", "italic", "link", "marker", "inlineCode"],
              config: {
                placeholder: "Start typing your text here...",
              },
            } as ToolSettings,

            header: {
              class: Header as unknown as ToolConstructable,
              inlineToolbar: ["bold", "italic", "link", "marker", "inlineCode"],
              config: {
                placeholder: "Enter a header",
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            } as ToolSettings,

            list: {
              class: List as unknown as ToolConstructable,
              inlineToolbar: ["bold", "italic", "link", "marker", "inlineCode"],
              config: {
                defaultStyle: "unordered",
              },
            } as ToolSettings,

            quote: {
              class: Quote as unknown as ToolConstructable,
              inlineToolbar: ["bold", "italic", "link", "marker", "inlineCode"],
              config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote's author",
              },
            } as ToolSettings,

            // IMAGE
            image: {
              class: ImageTool as unknown as ToolConstructable,
              config: {
                uploader: {
                  async uploadByFile(file: File) {
                    const formData = new FormData();
                    formData.append("image", file);

                    // Get auth token from localStorage
                    const token = localStorage.getItem("accessToken");
                    const headers: HeadersInit = {};
                    if (token) {
                      headers["Authorization"] = `Bearer ${token}`;
                      headers["x-access-token"] = token;
                    }

                    const res = await fetch(`${API_BASE_URL}/images`, {
                      method: "POST",
                      headers: headers,
                      body: formData,
                    });

                    if (!res.ok) {
                      const errorData = await res.json().catch(() => ({}));
                      throw new Error(errorData.message || "Failed to upload image");
                    }

                    const responseData = await res.json();

                    // Handle both EditorJS format and our API format
                    if (responseData.success === 1 && responseData.file) {
                      // Already in EditorJS format
                      return responseData;
                    } else if (responseData.success === true && responseData.data) {
                      // Our API format - convert to EditorJS format
                      return {
                        success: 1,
                        file: {
                          url: responseData.data.url,
                          name: responseData.data.filename || file.name,
                        },
                      };
                    } else {
                      throw new Error("Unexpected response format");
                    }
                  },
                },
              },
            } as ToolSettings,

            // TWITTER EMBED (Custom tool - works reliably!)
            twitter: TwitterEmbed as unknown as ToolConstructable,

            // YOUTUBE EMBED
            youtube: YoutubeEmbed as unknown as ToolConstructable,

            // FACEBOOK EMBED
            facebook: FacebookEmbed as unknown as ToolConstructable,

            // INLINE FORMATTING TOOLS
            marker: {
              class: Marker as unknown as ToolConstructable,
              shortcut: "CMD+SHIFT+M",
            } as ToolSettings,

            inlineCode: {
              class: InlineCode as unknown as ToolConstructable,
              shortcut: "CMD+SHIFT+C",
            } as ToolSettings,

            // VIDEO
            video: SimpleVideo as unknown as ToolConstructable,

            // AUDIO
            audio: SimpleAudio as unknown as ToolConstructable,
          },

          onReady: () => {
            if (isMounted) {
              console.log("✅ Editor.js ready with all tools!");
            }
          },

          onChange: async (api) => {
            try {
              const savedData = await api.saver.save();

              if (!isMounted) return;

              if (debounceRef.current) {
                clearTimeout(debounceRef.current);
              }

              debounceRef.current = setTimeout(() => {
                if (isMounted && onChangeRef.current) {
                  try {
                    onChangeRef.current(savedData);
                  } catch (error) {
                    console.error("Editor onChange handler error:", error);
                  }
                }
              }, 250);
            } catch (error) {
              console.warn("Editor save failed:", error);
            }
          },
        });

        editorRef.current = editor;
        isInitializedRef.current = true;

      } catch (error) {
        console.error("❌ Failed to initialize editor:", error);
      }
    };

    // Use a small timeout to ensure the DOM element is rendered
    const timer = setTimeout(() => {
      if (document.getElementById(holder) && !isInitializedRef.current) {
        initEditor();
      } else {
        // Retry once if not found immediately
        setTimeout(() => {
          if (isMounted && document.getElementById(holder) && !isInitializedRef.current) {
            initEditor();
          }
        }, 100);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      if (editorRef.current) {
        try {
          if (typeof editorRef.current.destroy === 'function') {
            editorRef.current.destroy();
          }
        } catch (e) {
          console.warn("Error cleaning up editor instance:", e);
        }
        editorRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [holder]); // Only reinitialize when holder changes

  return (
    <div className="editor-wrapper">
      <div id={holder} className="border rounded-lg p-4 min-h-[300px] prose max-w-none" />
      <style>{`
        /* Ensure inline toolbar is visible */
        .ce-inline-toolbar {
          z-index: 10000 !important;
          display: flex !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          padding: 4px !important;
        }
        .ce-toolbar__plus,
        .ce-toolbar__settings-btn {
          z-index: 1000 !important;
        }
        /* Make sure inline toolbar buttons are visible */
        .ce-inline-toolbar__button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 32px !important;
          height: 32px !important;
          border-radius: 4px !important;
          margin: 0 2px !important;
        }
        .ce-inline-toolbar__button:hover {
          background: #f3f4f6 !important;
        }
        .ce-inline-toolbar__button--active {
          background: #3b82f6 !important;
          color: white !important;
        }
        .codex-editor__redactor {
          padding-bottom: 200px !important;
        }
      `}</style>
    </div>
  );
};

export default Editor;

