import React, { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UploadCloud,
  FileVideo,
  Loader2,
  CheckCircle2,
  X,
  Trash2,
  Edit2,
  Link,
} from "lucide-react";
import {
  uploadVideo,
  fetchVideo,
  updateVideo,
} from "../../../store/slices/vedio";
import PopupAlert from "../../../components/popUpAlert";
import axiosInstance from "../../../services/axiosConfig";

// Fixed interface to match your store structure
interface RootState {
  vedio: {
    loading: boolean;
    error: string | null;
    data: any;
  };
}

// Fixed props interface to include fileId
type VideoLessonProps = {
  lessonId: string;
  videoId?: string;
  fileId?: string; // Added this missing prop
  onClose: () => void;
  onSaveSuccess?: (data: any) => void;
};

const sourcePlatforms = [
  { value: "videocypher", label: "Videocypher" },
  { value: "youtube", label: "YouTube" },
];

const VideoLesson: React.FC<VideoLessonProps> = ({
  lessonId,
  videoId,
  fileId,
  onClose,
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.vedio
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    sourcePlatform: "",
    file: null as File | null,
    videoId: "",
    secureUrl: "",
    embedUrl: "",
    originalUrl: "",
    youtubeUrl: "",
    thumbnail: "", // Added for VdoCipher
    quality: "auto", // Added for VdoCipher
    status: "", // Added for VdoCipher
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  // Enhanced getData function to handle VdoCipher data structure
  const getData = async () => {
    try {
      setIsEditMode(true);
      const response = await axiosInstance.get(`/video/${fileId}`);
      const videoData = response.data.data;
      
      setForm({
        title: videoData.title || "",
        description: videoData.description || "",
        sourcePlatform: videoData.sourcePlatform || "",
        file: null,
        videoId: videoData.videoId || "", // VdoCipher video ID
        secureUrl: videoData.secureUrl || "",
        embedUrl: videoData.secureUrl || "", // Use secureUrl for embed
        originalUrl: videoData.secureUrl || "",
        youtubeUrl: videoData.youtubeUrl || "",
        thumbnail: videoData.thumbnail || "",
        quality: videoData.quality || "auto",
        status: videoData.status || "",
      });
      
      console.log("Fetched VdoCipher video data:", videoData);
    } catch (error) {
      console.error("Error fetching video data:", error);
      setPopup({
        isVisible: true,
        message: "Failed to fetch video data",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (fileId) {
      getData();
    }
  }, [fileId]);

  useEffect(() => {
    if (isEditMode && data && !loading && !error) {
      setForm({
        title: data.title || "",
        description: data.description || "",
        sourcePlatform: data.sourcePlatform || "",
        file: null,
        videoId: data.videoId || "",
        secureUrl: data.secureUrl || "",
        embedUrl: data.embedUrl || data.secureUrl || "",
        originalUrl: data.originalUrl || data.secureUrl || "",
        youtubeUrl: data.youtubeUrl || "",
        thumbnail: data.thumbnail || "",
        quality: data.quality || "auto",
        status: data.status || "",
      });
    }
  }, [data, isEditMode, loading, error]);

  useEffect(() => {
    if (!loading && (data || error)) {
      if (data && !error) {
        if (onSaveSuccess) onSaveSuccess(data);
      } else if (error) {
        setPopup({
          isVisible: true,
          message: `Failed to ${isEditMode ? "update" : "upload"} video: ${error}`,
          type: "error",
        });
      }
    }
  }, [data, error, loading, isEditMode, onSaveSuccess]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setPopup({
        isVisible: true,
        message: "Please enter a video title.",
        type: "error",
      });
      return;
    }
    
    if (!form.sourcePlatform) {
      setPopup({
        isVisible: true,
        message: "Please select a source platform.",
        type: "error",
      });
      return;
    }

    // Enhanced validation for VdoCipher and YouTube
    if (form.sourcePlatform === "youtube") {
      if (!form.youtubeUrl.trim()) {
        setPopup({
          isVisible: true,
          message: "Please enter a YouTube URL.",
          type: "error",
        });
        return;
      }
      if (!isValidYouTubeUrl(form.youtubeUrl)) {
        setPopup({
          isVisible: true,
          message: "Please enter a valid YouTube URL.",
          type: "error",
        });
        return;
      }
    } else if (form.sourcePlatform === "videocypher") {
      // For new uploads, file is required
      if (!isEditMode && !form.file) {
        setPopup({
          isVisible: true,
          message: "Please select a video file to upload.",
          type: "error",
        });
        return;
      }
      // For updates, file is optional (only if user wants to replace video)
    }

    try {
      let response;
      
      if (isEditMode && (fileId || videoId)) {
        // For VdoCipher updates, we need to use the correct ID
        const updateId = fileId || videoId;
        
        // Show confirmation if replacing video file
        if (form.file && form.sourcePlatform === "videocypher") {
          const confirmReplace = window.confirm(
            `Are you sure you want to replace the current video with "${form.file.name}"? This action cannot be undone.`
          );
          if (!confirmReplace) {
            return;
          }
        }
        
        response = await dispatch(
          updateVideo({
            videoId: updateId, // Use fileId for VdoCipher updates
            file: form.sourcePlatform === "youtube" ? null : form.file,
            lessonId,
            sourcePlatform: form.sourcePlatform,
            title: form.title,
            description: form.description,
            youtubeUrl: form.sourcePlatform === "youtube" ? form.youtubeUrl : undefined,
            // Include VdoCipher specific fields if updating VdoCipher video
            ...(form.sourcePlatform === "videocypher" && {
              quality: form.quality,
              thumbnail: form.thumbnail,
              replaceVideo: !!form.file, // Flag to indicate video replacement
            }),
            accessToken: "",
            refreshToken: "",
          }) as any
        );
      } else {
        response = await dispatch(
          uploadVideo({
            file: form.sourcePlatform === "youtube" ? null : form.file,
            lessonId,
            sourcePlatform: form.sourcePlatform,
            title: form.title,
            description: form.description,
            youtubeUrl: form.sourcePlatform === "youtube" ? form.youtubeUrl : undefined,
            // Include VdoCipher specific fields if uploading to VdoCipher
            ...(form.sourcePlatform === "videocypher" && {
              quality: form.quality || "auto",
            }),
            accessToken: "",
            refreshToken: "",
          }) as any
        );
      }
      
      console.log("Video operation response:", response);
      
      if (response.payload?.success) {
        setPopup({
          isVisible: true,
          message: `Video ${isEditMode ? "updated" : "uploaded"} successfully!`,
          type: "success",
        });
        // Close after a short delay to show success message
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setPopup({
          isVisible: true,
          message: `Failed to ${isEditMode ? "update" : "upload"} video: ${
            response.payload?.message || "Unknown error"
          }`,
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Error saving video:", error);
      setPopup({
        isVisible: true,
        message: `Failed to ${isEditMode ? "update" : "upload"} video: ${
          error.message || "Network error"
        }`,
        type: "error",
      });
    }
  };

  const handleClose = () => {
    setPopup({ isVisible: false, message: "", type: "" });
    onClose();
  };

  // Enhanced render function to show VdoCipher status
  const renderVdoCipherInfo = () => {
    if (form.sourcePlatform === "videocypher" && isEditMode) {
      return (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">VdoCipher Video Info</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Video ID:</strong> {form.videoId}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                form.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {form.status || 'Unknown'}
              </span>
            </p>
            <p><strong>Quality:</strong> {form.quality}</p>
            {form.secureUrl && (
              <p><strong>Secure URL:</strong> 
                <span className="text-xs text-blue-600 ml-1">Available</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderSourceInput = () => {
    if (form.sourcePlatform === "youtube") {
      return (
        <div>
          <label className="block text-sm font-medium mb-2">
            YouTube URL *
          </label>
          <div className="relative">
            <input
              type="url"
              name="youtubeUrl"
              value={form.youtubeUrl}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          {form.youtubeUrl && !isValidYouTubeUrl(form.youtubeUrl) && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid YouTube URL
            </p>
          )}
          {form.youtubeUrl && isValidYouTubeUrl(form.youtubeUrl) && (
            <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Valid YouTube URL
            </p>
          )}
        </div>
      );
    } else if (form.sourcePlatform === "videocypher") {
      return (
        <div>
          <label className="block text-sm font-medium mb-2">
            Video File {!isEditMode ? '*' : ''}
          </label>
          <input
            type="file"
            name="file"
            accept="video/*"
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required={!isEditMode}
          />
          {form.file && (
            <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Selected: {form.file.name}
            </p>
          )}
          {isEditMode && !form.file && (
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to keep current video, or select a new file to replace it
            </p>
          )}
          {isEditMode && form.file && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
              <p className="text-sm text-amber-800">
                ⚠️ This will replace the current video with: <strong>{form.file.name}</strong>
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white lg:w-[700px] rounded-xl max-w-2xl w-full mx-auto shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileVideo className="w-6 h-6" />
          {isEditMode ? "Edit Video Lesson" : "Upload Video Lesson"}
        </h2>
        
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter video title"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            placeholder="Enter video description"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Source Platform *
          </label>
          <select
            name="sourcePlatform"
            value={form.sourcePlatform}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select platform</option>
            {sourcePlatforms.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {isEditMode && (
            <p className="mt-1 text-xs text-amber-600">
              ⚠️ Changing platform will replace the current video
            </p>
          )}
        </div>

        {/* Conditional rendering based on source platform */}
        {form.sourcePlatform && renderSourceInput()}
        
        {/* Show VdoCipher info if editing VdoCipher video */}
        {renderVdoCipherInfo()}
      </div>
      
      <div className="flex justify-end items-center gap-4 mt-8">
        <button
          onClick={handleClose}
          className="px-6 py-2 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
            loading
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isEditMode ? "Updating..." : "Uploading..."}
            </>
          ) : (
            <>
              {form.sourcePlatform === "youtube" ? (
                <Link className="w-5 h-5" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
              {isEditMode
                ? "Update Video"
                : form.sourcePlatform === "youtube"
                ? "Save Video"
                : "Upload Video"}
            </>
          )}
        </button>
      </div>
      
      <PopupAlert
        message={popup.message}
        type={popup.type}
        isVisible={popup.isVisible}
        onClose={() => {
          setPopup({ isVisible: false, message: "", type: "" });
        }}
      />
    </div>
  );
};

export default VideoLesson;