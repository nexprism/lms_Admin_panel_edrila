import React, { useState, useRef, useEffect } from 'react';
import { Upload, File, X, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, fetchFileById, updateFile } from '../../../store/slices/files'; // <-- fetchFileById, updateFile
import PopupAlert from '../../../components/popUpAlert';

export default function FileUploadForm({
  section,
  lesson,
  onChange,
  courseId,
  lessonId,
  fileId, // <-- Pass fileId for edit mode
  onSaveSuccess,
  onClose
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedFileType, setSelectedFileType] = useState('Select file type');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isFileTypeOpen, setIsFileTypeOpen] = useState(false);
  const [downloadable, setDownloadable] = useState(true);
  const [active, setActive] = useState(true);
  const [publicContent, setPublicContent] = useState(false);
  const [popup, setPopup] = useState({ isVisible: false, message: '', type: '' });
  const [isEditMode, setIsEditMode] = useState(false);

  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { uploading, error, success, file: fetchedFile } = useSelector((state: any) => state.file);

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const fileTypes = ['PDF', 'DOCX', 'VIDEO', 'IMAGE'];

  // Fetch file if editing
  useEffect(() => {
    if (fileId) {
      dispatch(fetchFileById(fileId));
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
      handleReset();
    }
    // eslint-disable-next-line
  }, [fileId, dispatch]);

  // Populate form with fetched file data
  useEffect(() => {
    if (isEditMode && fetchedFile && !uploading && !error) {
      setSelectedLanguage(fetchedFile.language || 'English');
      setSelectedFileType(fetchedFile.fileType || 'Select file type');
      setDownloadable(fetchedFile.downloadable ?? true);
      setActive(fetchedFile.active ?? true);
      setPublicContent(fetchedFile.isPublic ?? false);
      setSelectedFiles([]); // Don't prefill file input
    }
    // eslint-disable-next-line
  }, [fetchedFile, isEditMode, uploading, error]);

  // Handle success/error popups
  useEffect(() => {
    if (!uploading) {
      if (success) {
        setPopup({
          isVisible: true,
          message: `File ${isEditMode ? 'updated' : 'uploaded'} successfully!`,
          type: 'success'
        });
        if (onSaveSuccess) onSaveSuccess(success);
        handleReset();
      } else if (error) {
        setPopup({
          isVisible: true,
          message: `Failed to ${isEditMode ? 'update' : 'upload'} file. ${error}`,
          type: 'error'
        });
      }
    }
    // eslint-disable-next-line
  }, [success, error, uploading, isEditMode, onSaveSuccess]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadOrUpdate = async () => {
    // Validation
    if (!isEditMode && selectedFiles.length === 0) {
      setPopup({ isVisible: true, message: 'Please select files to upload', type: 'error' });
      return;
    }
    if (selectedFileType === 'Select file type') {
      setPopup({ isVisible: true, message: 'Please select a file type', type: 'error' });
      return;
    }

    try {
      if (isEditMode && fileId) {
        // Update file (metadata only, not file content)
        const payload = {
          id: fileId,
          language: selectedLanguage,
          fileType: selectedFileType,
          downloadable,
          active,
          isPublic: publicContent,
          lessonId,
          courseId
        };
        await dispatch(updateFile(payload));
      } else {
        // Upload each file individually
        const uploadPromises = selectedFiles.map(file => {
          const payload = {
            language: selectedLanguage,
            fileType: selectedFileType,
            downloadable,
            active,
            isPublic: publicContent,
            file,
            lessonId,
            courseId
          };
          return dispatch(uploadFile(payload));
        });
        await Promise.all(uploadPromises);
      }
    } catch (error) {
      setPopup({
        isVisible: true,
        message: `Failed to ${isEditMode ? 'update' : 'upload'} file. Please try again.`,
        type: 'error'
      });
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setSelectedLanguage('English');
    setSelectedFileType('Select file type');
    setDownloadable(true);
    setActive(true);
    setPublicContent(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setPopup({ isVisible: false, message: '', type: '' });
    if (onClose) onClose();
  };

  return (
    <div className="mx-auto p-6 bg-white">
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isEditMode ? 'Edit File' : 'Add New File'}
          </h2>
          {onClose && (
            <button onClick={handleClose} className="text-gray-500 hover:text-red-600">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
        {/* Language Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
            >
              <span>{selectedLanguage}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {isLanguageOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLanguageOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* File Type Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Type *
          </label>
          <div className="relative">
            <button
              onClick={() => setIsFileTypeOpen(!isFileTypeOpen)}
              className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
            >
              <span className={selectedFileType === 'Select file type' ? 'text-gray-400' : 'text-gray-900'}>
                {selectedFileType}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {isFileTypeOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {fileTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedFileType(type);
                      setIsFileTypeOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Upload Section */}
        {!isEditMode && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Upload</h3>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
                disabled={uploading}
              >
                Upload files from your PC
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </div>
            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <File className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={uploading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {/* Success Display */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">Files uploaded successfully!</p>
          </div>
        )}
        {/* Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Downloadable</label>
            <button
              onClick={() => setDownloadable(!downloadable)}
              disabled={uploading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                downloadable ? 'bg-blue-600' : 'bg-gray-200'
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  downloadable ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Active</label>
            <button
              onClick={() => setActive(!active)}
              disabled={uploading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                active ? 'bg-blue-600' : 'bg-gray-200'
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Public content</label>
            <button
              onClick={() => setPublicContent(!publicContent)}
              disabled={uploading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                publicContent ? 'bg-blue-600' : 'bg-gray-200'
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  publicContent ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleReset}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          <button
            onClick={handleUploadOrUpdate}
            disabled={
              uploading ||
              (!isEditMode && selectedFiles.length === 0) ||
              selectedFileType === 'Select file type'
            }
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditMode ? 'Updating...' : 'Uploading...'}
              </>
            ) : (
              isEditMode ? 'Update' : 'Upload'
            )}
          </button>
        </div>
      </div>
      <PopupAlert
        message={popup.message}
        type={popup.type}
        isVisible={popup.isVisible}
        onClose={() => setPopup({ ...popup, isVisible: false })}
      />
    </div>
  );
}