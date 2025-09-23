import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createJob,
  selectJobLoading,
  selectJobError,
} from "../../store/slices/job";
import { AppDispatch } from "../../store";
import QuillEditor from "../../components/QuillEditor";
import PopupAlert from "../../components/popUpAlert";

interface JobFormData {
  title: string;
  description: string;
  thumbnail: File | null;
  status: boolean;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  category: string;
  skillsRequired: string[];
  experienceLevel: "beginner" | "intermediate" | "expert";
  estimatedDuration: {
    value: number;
    unit: "hours" | "days" | "weeks" | "months";
  };
  mode: "full-time" | "part-time" | "contract" | "freelance" | "internship";
  location: {
    type: "remote" | "onsite" | "hybrid";
    address: string;
  };
}

const AddJob: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loading = useSelector(selectJobLoading);
  const error = useSelector(selectJobError);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState<JobFormData>({
    title: "",

    description: "",
    thumbnail: null,
    status: true,
    budget: {
      min: 0,
      max: 0,
      currency: "USD",
    },
    category: "",
    skillsRequired: [],
    experienceLevel: "beginner",
    estimatedDuration: {
      value: 1,
      unit: "months",
    },
    mode: "full-time",
    location: {
      type: "remote",
      address: "",
    },
  });

  const [newSkill, setNewSkill] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const parts = name.split(".");
      setFormData((prev) => {
        const newData = { ...prev };
        let current: Record<string, unknown> = newData;

        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]] as Record<string, unknown>;
        }

        const lastPart = parts[parts.length - 1];
        if (type === "number") {
          current[lastPart] = Number(value);
        } else if (type === "checkbox") {
          current[lastPart] = (e.target as HTMLInputElement).checked;
        } else {
          current[lastPart] = value;
        }

        return newData;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "number"
            ? Number(value)
            : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
      }));
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setPopup({
          isVisible: true,
          message: "File size should be less than 5MB",
          type: "error",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setPopup({
          isVisible: true,
          message: "Please upload a valid image file",
          type: "error",
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.location
    ) {
      setPopup({
        isVisible: true,
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    if (formData.budget.min >= formData.budget.max) {
      setPopup({
        isVisible: true,
        message: "Maximum budget should be greater than minimum budget",
        type: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPopup({
          isVisible: true,
          message: "User not authenticated",
          type: "error",
        });
      }

      const jobData = {
        ...formData,
        thumbnail: formData.thumbnail || undefined,
      };
      await dispatch(createJob({ job: jobData, token })).unwrap();

      setPopup({
        isVisible: true,
        message: "Job created successfully!",
        type: "success",
      });

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        thumbnail: null,
        status: true,
        budget: {
          min: 0,
          max: 0,
          currency: "USD",
        },
        category: "",
        skillsRequired: [],
        experienceLevel: "beginner",
        estimatedDuration: {
          value: 1,
          unit: "months",
        },
        mode: "full-time",
        location: {
          type: "remote",
          address: "",
        },
      });
    } catch (err) {
      setPopup({
        isVisible: true,
        message: err instanceof Error ? err.message : "Failed to create job",
        type: "error",
      });
    }
  };

  return (
    <>
      <PopupAlert
        isVisible={popup.isVisible}
        message={popup.message}
        type={popup.type}
        onClose={() => {
          setPopup({ isVisible: false, message: "", type: "" });
          if (popup.type === "success") {
            navigate("/jobs");
          }
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Add New Job
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <p className="text-red-700 dark:text-red-200">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter job title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Job Description *
                </label>
                <QuillEditor
                  value={formData.description}
                  onChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, description: value }))
                  }
                  placeholder="Enter detailed job description..."
                  height="200px"
                  toolbar="full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Job Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="technology">Technology</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="finance">Finance</option>
                    <option value="hr">Human Resources</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Experience Level *
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Experience Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Job Mode *
                  </label>
                  <select
                    name="mode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Job Mode</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Location Type *
                  </label>
                  <select
                    name="location.type"
                    value={formData.location.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Location Type</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job address (optional for remote jobs)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Currency *
                  </label>
                  <select
                    name="budget.currency"
                    value={formData.budget.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Budget Range
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Minimum Budget *
                  </label>
                  <input
                    type="number"
                    name="budget.min"
                    value={formData.budget.min}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Maximum Budget *
                  </label>
                  <input
                    type="number"
                    name="budget.max"
                    value={formData.budget.max}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Duration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Duration Value *
                  </label>
                  <input
                    type="number"
                    name="estimatedDuration.value"
                    value={formData.estimatedDuration.value}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Duration Unit *
                  </label>
                  <select
                    name="estimatedDuration.unit"
                    value={formData.estimatedDuration.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === "Enter" && handleAddSkill(e)}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Skill
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Job Image
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-medium file:border-gray-300 file:text-gray-700 dark:file:text-gray-200 dark:file:border-gray-600 dark:file:bg-gray-700 hover:file:bg-gray-100 dark:hover:file:bg-gray-600"
                />

                {formData.thumbnail && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Image preview:
                    </p>
                    <img
                      src={URL.createObjectURL(formData.thumbnail)}
                      alt="Job thumbnail preview"
                      className="w-32 h-20 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                      onError={(e) => {
                        // Fallback for broken images
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/icons/file-image.svg";
                      }}
                    />
                  </div>
                )}

                {!formData.thumbnail && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    No image selected. Upload a thumbnail image for the job.
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-10">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Job Status
                </h3>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="status"
                    id="status"
                    checked={formData.status}
                    onChange={() => setFormData((prev) => ({ ...prev, status: !prev.status }))}
                    className="w-4 h-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-medium file:border-gray-300 file:text-gray-700 dark:file:text-gray-200 dark:file:border-gray-600 dark:file:bg-gray-700 hover:file:bg-gray-100 dark:hover:file:bg-gray-600"
                  />
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 "
                  >
                    JOB Open
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddJob;
