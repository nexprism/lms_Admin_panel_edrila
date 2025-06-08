import React, { useState, useEffect ,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCourseBundle } from '../../store/slices/courseBundle';
import { fetchCourses } from '../../store/slices/course';
import { RootState } from '../../hooks/redux';

import { ChevronDown, X, Check } from 'lucide-react';

const MultiSelectDropdown = ({ courses, selectedCourses, onChange, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses?.data?.filter(course =>
    (course.title || course.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleCourseToggle = (courseId) => {
    const newSelection = selectedCourses.includes(courseId)
      ? selectedCourses.filter(id => id !== courseId)
      : [...selectedCourses, courseId];
    
    onChange(newSelection);
  };

  const removeCourse = (courseId) => {
    onChange(selectedCourses.filter(id => id !== courseId));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected courses display */}
      <div className="mb-2">
        <div className="flex flex-wrap gap-2">
          {selectedCourses.map(courseId => {
            const course = courses?.data?.find(c => (c._id || c.id) === courseId);
            const courseName = course?.title || course?.name || 'Unknown Course';
            
            return (
              <span
                key={courseId}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {courseName}
                <button
                  type="button"
                  onClick={() => removeCourse(courseId)}
                  className="ml-2 hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Dropdown trigger */}
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-700">
          {selectedCourses.length === 0 
            ? 'Select courses...' 
            : `${selectedCourses.length} course${selectedCourses.length > 1 ? 's' : ''} selected`
          }
        </span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options list */}
          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="p-4 text-center text-gray-600">Loading courses...</div>
            ) : filteredCourses.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                {searchTerm ? 'No courses found' : 'No courses available'}
              </div>
            ) : (
              filteredCourses.map(course => {
                const courseId = course._id || course.id;
                const courseName = course.title || course.name || 'Untitled Course';
                const isSelected = selectedCourses.includes(courseId);

                return (
                  <div
                    key={courseId}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleCourseToggle(courseId)}
                  >
                    <span className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {courseName}
                    </span>
                    {isSelected && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AddBundleForm = () => {



    
    const dispatch = useDispatch();
    
    // Redux state
    const { loading: bundleLoading, error: bundleError } = useSelector((state: RootState) => state.courseBundle);
    const { data: courses, loading: coursesLoading } = useSelector((state: RootState) => state.course);
    console.log('Courses:', courses);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        slug: '',
        description: '',
        language: 'English',
        level: 'Beginner',
        price: '',
        discount: '',
        currency: 'INR',
        courses: [],
        certificate: false,
        featured: false,
        downloadable: false,
        popular: false,
        private: false,
        tags: '',
        seoTitle: '',
        seoDescription: ''
    });
    
    const [files, setFiles] = useState({
        thumbnail: null,
        banner: null,
        video: null,
        attachmentFile: null,
        documentFile: null
    });
    
    const [selectedCourses, setSelectedCourses] = useState([]);

    // Fetch courses on component mount
    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files: fileList } = e.target;
        setFiles(prev => ({
            ...prev,
            [name]: fileList[0]
        }));
    };

    const handleCourseSelection = (courseId) => {
        setSelectedCourses(prev => {
            if (prev.includes(courseId)) {
                return prev.filter(id => id !== courseId);
            } else {
                return [...prev, courseId];
            }
        });
    };

    const handleSubmit = async () => {
        
        const bundleFormData = new FormData();
        
        // Append text fields
        Object.keys(formData).forEach(key => {
            if (key === 'courses') return; // Handle courses separately
            if (key === 'tags') {
                // Split tags by comma and append each tag separately
                const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
                tagsArray.forEach(tag => {
                    bundleFormData.append('tags', tag);
                });
            } else {
                bundleFormData.append(key, formData[key]);
            }
        });
        
        // Append selected courses
        selectedCourses.forEach(courseId => {
            bundleFormData.append('courses', courseId);
        });
        
        // Append files
        Object.keys(files).forEach(key => {
            if (files[key]) {
                bundleFormData.append(key, files[key]);
            }
        });

        try {
            await dispatch(createCourseBundle(bundleFormData)).unwrap();
            alert('Bundle created successfully!');
            // Reset form
            setFormData({
                title: '',
                subtitle: '',
                slug: '',
                description: '',
                language: 'English',
                level: 'Beginner',
                price: '',
                discount: '',
                currency: 'INR',
                courses: [],
                certificate: false,
                featured: false,
                downloadable: false,
                popular: false,
                private: false,
                tags: '',
                seoTitle: '',
                seoDescription: ''
            });
            setFiles({
                thumbnail: null,
                banner: null,
                video: null,
                attachmentFile: null,
                documentFile: null
            });
            setSelectedCourses([]);
        } catch (error) {
            console.error('Error creating bundle:', error);
        }
    };

    return (
        <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Course Bundle</h2>
            
            {bundleError && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    Error: {bundleError}
                </div>
            )}
            
            <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Complete Solar Energy Design Master Bundle"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subtitle
                        </label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Master 3 solar courses in one"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                    </label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="complete-solar-bundle"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="This bundle includes beginner to advanced courses..."
                    />
                </div>

                {/* Course Selection */}
              <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Courses *
    </label>
    <MultiSelectDropdown
        courses={courses}
        selectedCourses={selectedCourses}
        onChange={setSelectedCourses}
        loading={coursesLoading}
    />
    {selectedCourses.length === 0 && (
        <p className="text-sm text-red-600 mt-1">Please select at least one course</p>
    )}
</div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                        </label>
                        <select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Level
                        </label>
                        <select
                            name="level"
                            value={formData.level}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                        </label>
                        <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="699"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Price
                        </label>
                        <input
                            type="number"
                            name="discount"
                            value={formData.discount}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="249"
                        />
                    </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Thumbnail
                        </label>
                        <input
                            type="file"
                            name="thumbnail"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Banner
                        </label>
                        <input
                            type="file"
                            name="banner"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video
                        </label>
                        <input
                            type="file"
                            name="video"
                            onChange={handleFileChange}
                            accept="video/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attachment File
                        </label>
                        <input
                            type="file"
                            name="attachmentFile"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Document File
                        </label>
                        <input
                            type="file"
                            name="documentFile"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Boolean Options */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['certificate', 'featured', 'downloadable', 'popular', 'private'].map((field) => (
                        <div key={field} className="flex items-center">
                            <input
                                type="checkbox"
                                name={field}
                                id={field}
                                checked={formData[field]}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            <label htmlFor={field} className="text-sm font-medium text-gray-700 capitalize">
                                {field}
                            </label>
                        </div>
                    ))}
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="solar, engineering, renewable"
                    />
                </div>

                {/* SEO Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SEO Title
                        </label>
                        <input
                            type="text"
                            name="seoTitle"
                            value={formData.seoTitle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Solar Energy Design Course Bundle"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SEO Description
                        </label>
                        <textarea
                            name="seoDescription"
                            value={formData.seoDescription}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Get 3-in-1 solar courses and start your career in renewable energy."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={bundleLoading || selectedCourses.length === 0}
                        className={`px-6 py-3 rounded-md font-medium ${
                            bundleLoading || selectedCourses.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        } text-white transition duration-200`}
                    >
                        {bundleLoading ? 'Creating Bundle...' : 'Create Bundle'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddBundleForm;