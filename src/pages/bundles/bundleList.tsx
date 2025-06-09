import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchCourseBundles } from "../../store/slices/courseBundle";
import {
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Eye,
  Users,
  BookOpen,
  DollarSign,
  Pencil,
  Trash,
  Trash2


} from "lucide-react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import toast from "react-hot-toast";

interface Bundle {
  _id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  discountPrice?: number;
  status: "active" | "inactive" | "draft";
  isDeleted: boolean;
  thumbnail?: string;
  courses: string[];
  totalStudents?: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const BundleList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, data } = useAppSelector((state) => state.courseBundle);

  // Local state for UI management
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch bundles on component mount
  useEffect(() => {
    dispatch(fetchCourseBundles());
  }, [dispatch]);

  // Filter and search bundles - FIXED
  const filteredBundles = React.useMemo(() => {
    console.log("Filtering bundles with search:", searchInput, "and status:", statusFilter);
    console.log("Raw data:", data); // Debug log
    
    // Handle different possible data structures
    const bundles = Array.isArray(data) ? data : (data?.bundles || data?.data || []);
    
    if (!bundles || !Array.isArray(bundles)) {
      console.log("No valid bundles array found");
      return [];
    }
    
    let filtered = bundles.filter((bundle: Bundle) => !bundle.isDeleted);

    // Apply search filter
    if (searchInput.trim()) {
      filtered = filtered.filter((bundle: Bundle) =>
        bundle.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        bundle.description.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((bundle: Bundle) => bundle.status === statusFilter);
    }

    console.log("Filtered bundles:", filtered); // Debug log
    return filtered;
  }, [data, searchInput, statusFilter]); // FIXED: Use 'data' instead of 'data?.bundles'

  // Pagination logic
  const totalItems = filteredBundles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBundles = filteredBundles.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxPages = 5;

    const start = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const end = Math.min(totalPages, start + maxPages - 1);

    if (start > 1) pages.push(1, '...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push('...', totalPages);

    return pages;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'inactive':
        return 'text-red-500';
      case 'draft':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  // Debug logging
  useEffect(() => {
    console.log("Component state:", { loading, error, data });
    console.log("Filtered bundles count:", filteredBundles.length);
  }, [loading, error, data, filteredBundles.length]);

  return (
    <div>
      <PageMeta
        title="Bundle List | TailAdmin"
        description="List of all course bundles in TailAdmin"
      />
      <PageBreadcrumb pageTitle="Bundle List" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Course Bundles</h1>
          <span className="text-gray-500 text-sm dark:text-gray-400">Total: {totalItems}</span>
        </div>

        {/* Search & Filter */}
        <div className="bg-white shadow p-4 rounded-md mb-6 dark:bg-gray-900">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title or description..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm dark:text-gray-300">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* No Data Message - ADDED */}
        {!loading && !error && filteredBundles.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {searchInput || statusFilter ? "No bundles match your search criteria" : "No bundles available"}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredBundles.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-x-auto dark:bg-gray-900">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Thumbnail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 dark:bg-gray-900 dark:divide-gray-800">
                {currentBundles.map((bundle: Bundle, idx: number) => (
                  <tr key={bundle._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {startIndex + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={
                          bundle?.thumbnail
                            ? `${import.meta.env.VITE_IMAGE_URL}/${bundle.thumbnail}`
                            : `https://placehold.co/40x40?text=${bundle?.title?.charAt(0) || "B"}`
                        }
                        alt={bundle?.thumbnail ? bundle?.title : "No image"}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{bundle.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {bundle.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {bundle.courses?.length || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-medium">{formatPrice(bundle.price)}</span>
                        {bundle.discountPrice && (
                          <span className="text-xs text-green-600 dark:text-green-400">
                            Save {formatPrice(bundle.price - bundle.discountPrice)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {bundle.totalStudents || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`capitalize ${getStatusColor(bundle.status)}`}>
                        {bundle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(bundle.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                        <button 
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="View Details"
                        onClick={() => window.location.href = `/bundles/${bundle._id}`}
                        >
                        <Pencil className="h-5 w-5" />
                        </button>
                       
                    <button 
                      // onClick={() => openDeleteModal(cat)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {generatePageNumbers().map((page, idx) =>
                typeof page === "number" ? (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page 
                        ? "bg-indigo-500 text-white" 
                        : "bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={idx} className="px-2 text-gray-400 dark:text-gray-500">
                    {page}
                  </span>
                )
              )}
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleList;