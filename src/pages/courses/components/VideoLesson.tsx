import React, { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UploadCloud, FileVideo, Loader2, CheckCircle2, X, Trash2, Edit2, Link } from 'lucide-react';
import { uploadVideo, fetchVideo, updateVideo } from '../../../store/slices/vedio';
import PopupAlert from '../../../components/popUpAlert';

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
        title: '',
        description: '',
        sourcePlatform: '',
        file: null as File | null,
        videoId: '',
        secureUrl: '',
        embedUrl: '',
        originalUrl: '',
        youtubeUrl: '', // Added YouTube URL field
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [popup, setPopup] = useState({ isVisible: false, message: '', type: '' });

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
                title: data.title || '',
                description: data.description || '',
                sourcePlatform: data.sourcePlatform || '',
                file: null,
                videoId: data.videoId || '',
                secureUrl: data.secureUrl || '',
                embedUrl: data.embedUrl || '',
                originalUrl: data.originalUrl || '',
                youtubeUrl: data.youtubeUrl || data.originalUrl || '', // Use existing URL data
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as any;
        if (name === 'file') {
            setForm(prev => ({ ...prev, file: files?.[0] || null }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // Function to validate YouTube URL
    const isValidYouTubeUrl = (url: string): boolean => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
        return youtubeRegex.test(url);
    };

    const handleSave = () => {
        if (!form.title.trim()) {
            setPopup({ isVisible: true, message: 'Please enter a video title.', type: 'error' });
            return;
        }
        if (!form.sourcePlatform) {
            setPopup({ isVisible: true, message: 'Please select a source platform.', type: 'error' });
            return;
        }

        // Validation based on source platform
        if (form.sourcePlatform === 'youtube') {
            if (!form.youtubeUrl.trim()) {
                setPopup({ isVisible: true, message: 'Please enter a YouTube URL.', type: 'error' });
                return;
            }
            if (!isValidYouTubeUrl(form.youtubeUrl)) {
                setPopup({ isVisible: true, message: 'Please enter a valid YouTube URL.', type: 'error' });
                return;
            }
        } else if ((form.sourcePlatform === 'manual' || form.sourcePlatform === 'videocypher') && !isEditMode && !form.file) {
            setPopup({ isVisible: true, message: 'Please select a video file to upload.', type: 'error' });
            return;
        }
        
        if (isEditMode && videoId) {
            dispatch(
                updateVideo({
                    videoId,
                    file: form.sourcePlatform === 'youtube' ? null : form.file,
                    lessonId,
                    sourcePlatform: form.sourcePlatform,
                    title: form.title,
                    description: form.description,
                    youtubeUrl: form.sourcePlatform === 'youtube' ? form.youtubeUrl : undefined,
                    accessToken: '',
                    refreshToken: '',
                }) as any
            );
        } else {
            dispatch(
                uploadVideo({
                    file: form.sourcePlatform === 'youtube' ? null : form.file,
                    lessonId,
                    sourcePlatform: form.sourcePlatform,
                    title: form.title,
                    description: form.description,
                    youtubeUrl: form.sourcePlatform === 'youtube' ? form.youtubeUrl : undefined,
                    accessToken: '',
                    refreshToken: '',
                }) as any
            );
        }
    };

    const handleClose = () => {
        setPopup({ isVisible: false, message: '', type: '' });
        onClose();
    };

    // Helper function to render the appropriate input based on source platform
    const renderSourceInput = () => {
        if (form.sourcePlatform === 'youtube') {
            return (
                <div>
                    <label className="block text-sm font-medium mb-2">YouTube URL *</label>
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
        } else if ((form.sourcePlatform === 'manual' || form.sourcePlatform === 'videocypher') && !isEditMode) {
            return (
                <div>
                    <label className="block text-sm font-medium mb-2">Video File *</label>
                    <input
                        type="file"
                        name="file"
                        accept="video/*"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                    />
                    {form.file && (
                        <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Selected: {form.file.name}
                        </p>
                    )}
                </div>
            );
        } else if (form.sourcePlatform === 'vimeo' || form.sourcePlatform === 'external_link') {
            return (
                <div>
                    <label className="block text-sm font-medium mb-2">
                        {form.sourcePlatform === 'vimeo' ? 'Vimeo URL' : 'External Link'} *
                    </label>
                    <div className="relative">
                        <input
                            type="url"
                            name="originalUrl"
                            value={form.originalUrl}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={form.sourcePlatform === 'vimeo' ? 'https://vimeo.com/...' : 'https://...'}
                            required
                        />
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl max-w-2xl w-full mx-auto shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileVideo className="w-6 h-6" />
                    {isEditMode ? 'Edit Video Lesson' : 'Upload Video Lesson'}
                </h2>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                </button>
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
                    <label className="block text-sm font-medium mb-2">Source Platform *</label>
                    <select
                        name="sourcePlatform"
                        value={form.sourcePlatform}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select platform</option>
                        {sourcePlatforms.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Conditional rendering based on source platform */}
                {form.sourcePlatform && renderSourceInput()}
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
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {isEditMode ? 'Updating...' : 'Uploading...'}
                        </>
                    ) : (
                        <>
                            {form.sourcePlatform === 'youtube' ? <Link className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
                            {isEditMode ? 'Update Video' : (form.sourcePlatform === 'youtube' ? 'Save Video' : 'Upload Video')}
                        </>
                    )}
                </button>
            </div>
            <PopupAlert
                message={popup.message}
                type={popup.type}
                isVisible={popup.isVisible}
                onClose={() => setPopup({ isVisible: false, message: '', type: '' })}
            />
        </div>
    );
};

export default VideoLesson;
