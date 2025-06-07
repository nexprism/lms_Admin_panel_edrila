import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, User, FileText, Upload, X } from 'lucide-react';

export default function AddAssignmentForm() {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    language: 'English',
    description: '',
    score: '',
    maxScore: '',
    duration: '',
    materials: '',
    file: null,
    document: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const removeFile = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Assignment Data:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Assignments</h1>
              <p className="text-blue-100">Add New Assignment</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-lg shadow-lg p-6">
          <div className="space-y-6">
            {/* Assignment Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter assignment title"
                required
              />
            </div>

            {/* Subject and Language Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject*
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Art">Art</option>
                  <option value="Physical Education">Physical Education</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="A homework is to be completed on your course of CSS and research yourself that you've got this! Please send your homework as soon as possible. Regards."
                required
              />
            </div>

            {/* Score and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score
                </label>
                <input
                  type="number"
                  name="score"
                  value={formData.score}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Score
                </label>
                <input
                  type="number"
                  name="maxScore"
                  value={formData.maxScore}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="250"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="60"
                />
              </div>
            </div>

            {/* Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials
              </label>
              <input
                type="text"
                name="materials"
                value={formData.materials}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Maximum 255 characters"
                maxLength={255}
              />
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {formData.file ? (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {formData.file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('file')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Choose an attachment</p>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'file')}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        Browse Files
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  {formData.document ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {formData.document.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('document')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload document</p>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'document')}
                        className="hidden"
                        id="document-upload"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      <label
                        htmlFor="document-upload"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                      >
                        Browse Documents
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}