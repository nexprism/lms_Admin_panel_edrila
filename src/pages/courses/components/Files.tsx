import React, { useState, useRef } from 'react';
import { Upload, File, X, ChevronDown } from 'lucide-react';

export default function FileUploadForm() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedFileType, setSelectedFileType] = useState('Select file type');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isFileTypeOpen, setIsFileTypeOpen] = useState(false);
  const [downloadable, setDownloadable] = useState(true);
  const [active, setActive] = useState(true);
  const [publicContent, setPublicContent] = useState(false);
  const fileInputRef = useRef(null);

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const fileTypes = ['PDF', 'DOCX', 'TXT', 'CSV', 'XLSX', 'Images', 'Videos'];

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

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }
    console.log('Uploading files:', selectedFiles);
    alert(`Uploading ${selectedFiles.length} file(s)...`);
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

  return (
    <div className=" mx-auto p-6 bg-white">
      <div className="space-y-6">
        {/* Add New File Section */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New File</h2>
          
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
              File Type
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
        </div>

        {/* Upload Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Upload</h3>
          
          {/* File Upload Area */}
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
            >
              Upload files from your PC
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
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
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Downloadable</label>
            <button
              onClick={() => setDownloadable(!downloadable)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                downloadable ? 'bg-blue-600' : 'bg-gray-200'
              }`}
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                active ? 'bg-blue-600' : 'bg-gray-200'
              }`}
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                publicContent ? 'bg-blue-600' : 'bg-gray-200'
              }`}
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            Reset
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}