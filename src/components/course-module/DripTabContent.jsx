import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Zap, Settings, X } from 'lucide-react';

const CourseAccordion = () => {
    const [expandedModules, setExpandedModules] = useState(new Set());
    const [modalData, setModalData] = useState(null);

    const toggleModule = (moduleId) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId);
        } else {
            newExpanded.add(moduleId);
        }
        setExpandedModules(newExpanded);
    };

    const openModal = (type, lesson, module) => {
        setModalData({ type, lesson, module });
    };

    const closeModal = () => {
        setModalData(null);
    };

    const modules = [
        {
            id: 1,
            name: "Introduction to Web Development",
            lessons: [
                { id: 1, name: "Getting Started with HTML" },
                { id: 2, name: "Understanding CSS Basics" },
                { id: 3, name: "Introduction to JavaScript" },
                { id: 4, name: "Setting up Development Environment" }
            ]
        },
        {
            id: 2,
            name: "Advanced JavaScript Concepts",
            lessons: [
                { id: 5, name: "Async/Await and Promises" },
                { id: 6, name: "ES6+ Features" },
                { id: 7, name: "DOM Manipulation" },
                { id: 8, name: "Event Handling" }
            ]
        },
        {
            id: 3,
            name: "React Fundamentals",
            lessons: [
                { id: 9, name: "Component Architecture" },
                { id: 10, name: "State Management" },
                { id: 11, name: "Props and Data Flow" },
                { id: 12, name: "Hooks Introduction" }
            ]
        },
        {
            id: 4,
            name: "Backend Development",
            lessons: [
                { id: 13, name: "Node.js Basics" },
                { id: 14, name: "Express.js Framework" },
                { id: 15, name: "Database Integration" },
                { id: 16, name: "API Development" }
            ]
        }
    ];

    return (
        <div className="max-w-full mx-auto min-h-fit">
            <div className="bg-white rounded-lg shadow-lg border border-blue-100">
                
                <div className="divide-y divide-blue-100">
                    {modules.map((module) => (
                        <div key={module.id} className="bg-white">
                            {/* Module Header */}
                            <div
                                className="flex items-center justify-between p-4 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                                onClick={() => toggleModule(module.id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="transition-transform duration-300 ease-in-out">
                                        {expandedModules.has(module.id) ? (
                                            <ChevronDown className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-blue-600" />
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {module.name}
                                    </h3>
                                </div>
                                <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
                                    {module.lessons.length} lessons
                                </div>
                            </div>

                            {/* Lessons List */}
                            <div 
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                    expandedModules.has(module.id) 
                                        ? 'max-h-screen opacity-100' 
                                        : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="bg-blue-50 border-t border-blue-100">
                                    {module.lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center justify-between p-4 pl-12 hover:bg-white transition-colors duration-200 border-b border-blue-100 last:border-b-0"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <span className="text-gray-900 font-medium">
                                                    {lesson.name}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        openModal('view', lesson, module);
                                                    }}
                                                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>View</span>
                                                </button>
                                                
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        // Just prevent default, no modal
                                                        console.log('Drip clicked for:', lesson.name);
                                                    }}
                                                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium shadow-sm"
                                                >
                                                    <Zap className="w-4 h-4" />
                                                    <span>Drip</span>
                                                </button>
                                                
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        // Just prevent default, no modal
                                                        console.log('Settings clicked for:', lesson.name);
                                                    }}
                                                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-colors duration-200"
                                                >
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal - Only for View */}
            {modalData && modalData.type === 'view' && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] bg-opacity-50 flex items-center justify-center z-[10000] p-4"
                    onClick={closeModal}
                >
                    <div 
                        className="bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Course Access Settings
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                            Where do you want to make this course available?
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Choose the platform(s) where students can access this lesson.
                                        </p>
                                        
                                        <div className="space-y-3">
                                            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200">
                                                <input 
                                                    type="radio" 
                                                    id="phone-only" 
                                                    name="access-type" 
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <label htmlFor="phone-only" className="ml-3 flex-1 cursor-pointer">
                                                    <div className="font-medium text-gray-900">Phone Only</div>
                                                    <div className="text-sm text-gray-600">Mobile app access only</div>
                                                </label>
                                            </div>
                                            
                                            <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all duration-200">
                                                <input 
                                                    type="radio" 
                                                    id="both-platforms" 
                                                    name="access-type" 
                                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    defaultChecked
                                                />
                                                <label htmlFor="both-platforms" className="ml-3 flex-1 cursor-pointer">
                                                    <div className="font-medium text-gray-900">Web & App Both</div>
                                                    <div className="text-sm text-gray-600">Available on all platforms</div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const selectedOption = document.querySelector('input[name="access-type"]:checked');
                                        console.log('Selected access type:', selectedOption ? selectedOption.id : 'none');
                                        closeModal();
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseAccordion;