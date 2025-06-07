import React, { useState, useRef, useEffect } from 'react';

const TextLessonEditor = () => {
  const [formData, setFormData] = useState({
    language: 'English',
    title: '',
    bookTitle: '',
    accessibility: 'free',
    attachments: [],
    summary: '',
    content: ''
  });
  
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [bookTitleCharCount, setBookTitleCharCount] = useState(0);
  const [archive, setArchive] = useState(true);
  const [dropContent, setDropContent] = useState(true);

  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    // Load Quill dynamically
    const loadQuill = async () => {
      if (typeof window !== 'undefined' && !window.Quill) {
        // Load Quill CSS
        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Load Quill JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
        script.onload = initializeQuill;
        document.head.appendChild(script);
      } else if (window.Quill) {
        initializeQuill();
      }
    };

    const initializeQuill = () => {
      if (editorRef.current && !quillRef.current) {
        quillRef.current = new window.Quill(editorRef.current, {
          theme: 'snow',
          placeholder: 'Start writing your lesson content...',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['link', 'image', 'video'],
              ['blockquote', 'code-block'],
              [{ 'script': 'sub'}, { 'script': 'super' }],
              ['clean']
            ]
          }
        });

        quillRef.current.on('text-change', () => {
          const content = quillRef.current.root.innerHTML;
          setFormData(prev => ({ ...prev, content }));
        });
      }
    };

    loadQuill();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'title') {
      setTitleCharCount(value.length);
    } else if (field === 'bookTitle') {
      setBookTitleCharCount(value.length);
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    console.log('Saving lesson:', formData);
    alert('Lesson saved successfully!');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      setFormData({
        language: 'English',
        title: '',
        bookTitle: '',
        accessibility: 'free',
        attachments: [],
        summary: '',
        content: ''
      });
      setTitleCharCount(0);
      setBookTitleCharCount(0);
      if (quillRef.current) {
        quillRef.current.setContents([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd"/>
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Add new text lesson</h1>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Between 255 characters"
              maxLength={255}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {titleCharCount}/255
            </div>
          </div>

          {/* Book Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Title
            </label>
            <input
              type="text"
              value={formData.bookTitle}
              onChange={(e) => handleInputChange('bookTitle', e.target.value)}
              placeholder="+"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Accessibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Accessibility
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accessibility"
                  value="free"
                  checked={formData.accessibility === 'free'}
                  onChange={(e) => handleInputChange('accessibility', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Free</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="accessibility"
                  value="paid"
                  checked={formData.accessibility === 'paid'}
                  onChange={(e) => handleInputChange('accessibility', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Paid</span>
              </label>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm">Choose related files or lesson attachments.</span>
              </label>
            </div>
            
            {formData.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Write a brief summary of the lesson..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <div ref={editorRef} style={{ minHeight: '300px' }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={archive}
                  onChange={(e) => setArchive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={dropContent}
                  onChange={(e) => setDropContent(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Drip content</span>
              </label>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextLessonEditor;