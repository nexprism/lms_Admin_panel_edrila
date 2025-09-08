import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import {
  fetchJobs,
  deleteJob,
  updateJobStatus,
  selectJobs,
  selectJobLoading,
  selectJobError,
  selectCurrentPage,
  selectTotalPages,
} from "../../store/slices/job";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import JobProposals from "../../components/jobs/JobProposals";
import PopupAlert from "../../components/popUpAlert";

interface ProposalUser {
  _id: string;
  fullName: string;
  email: string;
  profilePicture: string;
}

interface Proposal {
  _id: string;
  userId: ProposalUser;
  coverLetter: string;
  cv: string;
  proposedAmount: number;
  status: "pending" | "accepted" | "rejected";
  submittedAt: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  category: string;
  skillsRequired: string[];
  experienceLevel: string;
  estimatedDuration: {
    value: number;
    unit: string;
  };
  mode: string;
  location: {
    type: string;
    address: {
      street?: string;
    };
  };
  status: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt?: string;
  proposals?: Proposal[];
}

const JobList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobLoading);
  const error = useSelector(selectJobError);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showProposals, setShowProposals] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/";

  useEffect(() => {
    const filters: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
    } = { page, limit };
    if (categoryFilter) filters.category = categoryFilter;
    if (searchTerm) filters.search = searchTerm;
    // Note: status and budget filters are handled client-side for now
    dispatch(fetchJobs(filters));
  }, [dispatch, page, limit, categoryFilter, searchTerm]);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof job.location.address === "object" &&
            // Safely check for street property in address
            (job.location.address as any)?.street
              ?.toLowerCase()
              ?.includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter) {
      const statusBool = statusFilter === "active";
      filtered = filtered.filter((job) => job.status === statusBool);
    }

    if (categoryFilter) {
      filtered = filtered.filter((job) => job.category === categoryFilter);
    }

    // Type assertion to fix type mismatch
    setFilteredJobs(filtered as unknown as Job[]);
  }, [jobs, searchTerm, statusFilter, categoryFilter]);

  // Function to open proposals modal
  const handleViewProposals = (job: Job) => {
    setSelectedJob(job);
    setShowProposals(true);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: boolean) => {
    if (status) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    } else {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  };

  const getStatusText = (status: boolean) => {
    return status ? "Active" : "Inactive";
  };

  const getExperienceLevelText = (level: string) => {
    switch (level) {
      case "entry":
        return "Entry Level";
      case "junior":
        return "Junior (1-3 years)";
      case "mid":
        return "Mid Level (3-5 years)";
      case "senior":
        return "Senior (5+ years)";
      case "expert":
        return "Expert (10+ years)";
      default:
        return level;
    }
  };

  const handleDelete = async (jobId: string) => {
    setIsDeleteModalOpen(false);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setPopup({
            isVisible: true,
            message: "Authentication required",
            type: "error",
          });
          return;
        }
        await dispatch(deleteJob({ jobId, token })).unwrap();
        setPopup({
          isVisible: true,
          message: "Job deleted successfully!",
          type: "success",
        });
      } catch (err) {
        console.error("Failed to delete job:", err);
        setPopup({
          isVisible: true,
          message: "Failed to delete job. Please try again.",
          type: "error",
        });
      }
    
  };

  const handleToggleStatus = async (job: Job) => {
    try {
      const newStatus = !job.status;
      const statusText = newStatus ? "open" : "close";
      if (window.confirm(`Are you sure you want to ${statusText} this job?`)) {
        await dispatch(
          updateJobStatus({ jobId: job._id, status: newStatus })
        ).unwrap();
        setPopup({
          isVisible: true,
          message: `Job ${statusText}d successfully!`,
          type: "success",
        });
      }
    } catch (err) {
      console.error("Failed to update job status:", err);
      setPopup({
        isVisible: true,
        message: "Failed to update job status. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[999] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/10 bg-opacity-30 backdrop-blur-xs transition-opacity"></div>

            {/* Modal */}
            <div className="relative z-50 mx-auto w-full max-w-sm rounded-lg  bg-white dark:bg-gray-800/10 p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-900">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-center text-gray-900 dark:text-white">
                Delete Event
              </h3>
              <p className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this event? This action cannot
                be undone.
              </p>

              <div className="mt-4 flex justify-center space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => handleDelete(selectedJob?._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <PopupAlert
        isVisible={popup.isVisible}
        message={popup.message}
        type={popup.type}
        onClose={() => {
          setPopup({ isVisible: false, message: "", type: "" });
        }}
      />
      <PageMeta
        title="Jobs Management | LMS Admin Panel"
        description="Manage job postings and applications"
      />
      <PageBreadcrumb pageTitle="Jobs" />

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Jobs Management
          </h2>
          <Link
            to="/jobs/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Job
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="technology">Technology</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setCategoryFilter("");
                  setPage(1);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                {job.thumbnail ? (
                  <img
                    src={`${job.thumbnail}`}
                    alt={job.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      // Hide the image if it fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <img
                        src="/images/icons/file-image.svg"
                        alt="No image"
                        className="w-12 h-12 mx-auto mb-2 opacity-50"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No image
                      </p>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {job.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {getStatusText(job.status)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Budget:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(job.budget.min, job.budget.currency)} -{" "}
                        {formatCurrency(job.budget.max, job.budget.currency)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Location:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {job.location.type === "remote"
                          ? "Remote"
                          : job.location.address?.street || "On-site"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Experience:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {getExperienceLevelText(job.experienceLevel)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Duration:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {job.estimatedDuration.value}{" "}
                        {job.estimatedDuration.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skillsRequired.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skillsRequired.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                        +{job.skillsRequired.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <Link
                      to={`/jobs/edit/${job._id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </Link>

                    <button
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => handleViewProposals(job)}
                    >
                      Proposals
                      {job.proposals && job.proposals.length > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                          {job.proposals.length}
                        </span>
                      )}
                    </button>

                    <button
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => {
                        setSelectedJob(job);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {filteredJobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m8 0V8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m8 0H8"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No jobs found
              </h3>
              <p className="text-sm">
                Get started by creating your first job posting.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Job Proposals Modal */}
      {selectedJob && (
        <JobProposals
          proposals={selectedJob.proposals || []}
          isOpen={showProposals}
          onClose={() => setShowProposals(false)}
          jobTitle={selectedJob.title}
          jobId={selectedJob._id}
        />
      )}
    </>
  );
};

export default JobList;
