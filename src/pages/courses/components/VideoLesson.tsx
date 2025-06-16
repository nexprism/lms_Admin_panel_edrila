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
    // Changed from 'video' to 'vedio' to match your store
    loading: boolean;
    error: string | null;
    data: any;
  };
}

type VideoLessonProps = {
  lessonId: string;
  videoId?: string;
  onClose: () => void;
  onSaveSuccess?: (data: any) => void;
};

const sourcePlatforms = [
  { value: "videocypher", label: "Videocypher" },
  { value: "manual", label: "Manual Upload" },
  { value: "youtube", label: "YouTube" },
  { value: "vimeo", label: "Vimeo" },
  { value: "external_link", label: "External Link" },
];

const VideoLesson: React.FC<VideoLessonProps> = ({
  lessonId,
  videoId,
  fileId,
  onClose,
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();

  // Fixed selector to match store structure and destructure all needed values
  const { data, loading, error } = useSelector(
    (state: RootState) => state.vedio
  );

  console.log("VideoLesson data:", fileId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    sourcePlatform: "",
    file: null as File | null,
    videoId: "",
    secureUrl: "",
    embedUrl: "",
    originalUrl: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (videoId) {
      setIsEditMode(true);
      dispatch(
        fetchVideo({ fileId, accessToken: "", refreshToken: "" }) as any
      );
    }
  }, [videoId, dispatch]);

  const getData = async () => {
    setIsEditMode(true);
    const response = await axiosInstance.get(`/video/${fileId}`);
    const data = response.data.data;
    setForm({
      title: data.title || "",
      description: data.description || "",
      sourcePlatform: data.sourcePlatform || "",
      file: null,
      videoId: data.secureUrl || "",
      secureUrl: data.secureUrl || "",
      embedUrl: data.embedUrl || "",
      originalUrl: data.originalUrl || "",
    });
    console.log("Fetched video data:", data);
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
        embedUrl: data.embedUrl || "",
        originalUrl: data.originalUrl || "",
      });
    }
  }, [data, isEditMode, loading, error]);

  useEffect(() => {
    if (!loading && (data || error)) {
      if (data && !error) {
        setPopup({
          isVisible: true,
          message: `Video ${isEditMode ? "updated" : "uploaded"} successfully!`,
          type: "success",
        });
        if (onSaveSuccess) onSaveSuccess(data);
      } else if (error) {
        setPopup({
          isVisible: true,
          message: `Failed to ${
            isEditMode ? "update" : "upload"
          } video: ${error}`,
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
      console.log("Selected file:", files?.[0]);
      setForm((prev) => ({ ...prev, file: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getUrlForFile = (file: File | null): string => {
    if (!file) return "";
    return URL.createObjectURL(file);
  };

  const handleSave = () => {
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
    if (!isEditMode && !form.file) {
      setPopup({
        isVisible: true,
        message: "Please select a video file to upload.",
        type: "error",
      });
      return;
    }

    if (isEditMode && videoId) {
      dispatch(
        updateVideo({
          videoId,
          file: form.file,
          lessonId,
          sourcePlatform: form.sourcePlatform,
          title: form.title,
          description: form.description,
          accessToken: "",
          refreshToken: "",
        }) as any
      );
    } else {
      dispatch(
        uploadVideo({
          file: form.file,
          lessonId,
          sourcePlatform: form.sourcePlatform,
          title: form.title,
          description: form.description,
          accessToken: "",
          refreshToken: "",
        }) as any
      );
    }
  };

  const handleClose = () => {
    setPopup({ isVisible: false, message: "", type: "" });
    onClose();
  };

  return (
    <div className="bg-white rounded-xl max-w-2xl w-full mx-auto shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileVideo className="w-6 h-6" />
          {isEditMode ? "Edit Video Lesson" : "Upload Video Lesson"}
        </h2>
        {/* <div onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </div> */}
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
        </div>
        {
          <div>
            <label className="block text-sm font-medium mb-2">
              Video File *
            </label>
            <input
              type="file"
              name="file"
              accept="video/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            {(form.file || form.secureUrl) && (
              <video className="mt-2 rounded-xl shadow-lg" controls>
                <source
                  src={form.file ? getUrlForFile(form.file) : form.secureUrl}
                  type="video/mp4"
                />
              </video>
            )}
          </div>
        }
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
              <UploadCloud className="w-5 h-5" />
              {isEditMode ? "Update Video" : "Upload Video"}
            </>
          )}
        </button>
      </div>
      <PopupAlert
        message={popup.message}
        type={popup.type}
        isVisible={popup.isVisible}
        onClose={() => setPopup({ isVisible: false, message: "", type: "" })}
      />
    </div>
  );
};

export default VideoLesson;
