import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  createCourseCategory,
  createSubCategory,
  fetchCourseCategories,
} from "../store/slices/courseCategorySlice";
import { fetchSubcategoriesByCategory } from "../store/slices/filter"; // import your thunk
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

interface CategorySubcategoryDropdownsProps {
  onCategoryChange?: (categoryId: string, categoryName: string) => void;
  onSubcategoryChange?: (
    subcategoryId: string,
    subcategoryName: string
  ) => void;
  selectedCategoryId?: string;
  selectedSubcategoryId?: string;
  disabled?: boolean;
}

export default function CategorySubcategoryDropdowns({
  onCategoryChange,
  onSubcategoryChange,
  selectedCategoryId = "",
  selectedSubcategoryId = "",
  disabled = false,
}: CategorySubcategoryDropdownsProps) {
  const dispatch = useAppDispatch();
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupFor, setPopupFor] = React.useState<
    "category" | "subcategory" | null
  >(null);
  const {
    categories,
    loading: categoriesLoading,
    error,
  } = useAppSelector((state) => state.courseCategory);
  const [data, setData] = React.useState({
    title: "",
    image: null,
  });

  // Get subcategories and loading/error from filter slice
  const {
    data: filterData,
    loading: subcategoriesLoading,
    error: subcategoriesError,
  } = useAppSelector((state) => state.filter);
  const subcategories: SubCategory[] = filterData?.subcategories || [];

  // Fetch categories on mount
  useEffect(() => {
    dispatch(
      fetchCourseCategories({
        page: 0,
        limit: 1000,
        filters: {
          status: "active",
          isDeleted: false,
        },
      })
    );
  }, [dispatch]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchSubcategoriesByCategory(selectedCategoryId));
    }
  }, [dispatch, selectedCategoryId]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    if (categoryId === "add-new-category") {
      setShowPopup(true);
      setPopupFor("category");
      return;
    }
    const categoryName =
      categories.find((cat) => cat._id === categoryId)?.name || "";

    // Reset subcategory when category changes
    if (onSubcategoryChange) {
      onSubcategoryChange("", "");
    }

    if (onCategoryChange) {
      onCategoryChange(categoryId, categoryName);
    }
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategoryId = e.target.value;
    if (subcategoryId === "add-new-category") {
      setShowPopup(true);
      setPopupFor("subcategory");
      return;
    }
    const subcategoryName =
      subcategories.find((subcat) => subcat._id === subcategoryId)?.name || "";

    if (onSubcategoryChange) {
      onSubcategoryChange(subcategoryId, subcategoryName);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", data.title);
      formData.append("image", data.image);
      formData.append("status", "active");

      if (popupFor === "subcategory" && !selectedCategoryId) {
        toast.error("Please select a category before adding a subcategory.");
        return;
      }
      if (popupFor === "subcategory") {
        formData.append("categoryId", selectedCategoryId);
      }

      //   Dispatch your action here
      if (popupFor === "category") {
        await dispatch(createCourseCategory(formData)).unwrap();
      } else if (popupFor === "subcategory") {
        await dispatch(createSubCategory(formData)).unwrap();
        toast.success("New subcategory added successfully!");
      }
      setData({ title: "", image: null }); // Reset form data after successful submission
      setShowPopup(false); // Close the popup
      dispatch(fetchSubcategoriesByCategory());
      console.log("New Category Added:", data);
    } catch (error) {
      console.error("Error adding new category:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Dropdown */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          disabled={disabled || categoriesLoading}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-800"
          required
        >
          <option value="">
            {categoriesLoading ? "Loading categories..." : "Select a category"}
          </option>
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
          <option value={"add-new-category"} className="text-blue-500">
            <Plus /> Add New Category
          </option>
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            Error loading categories: {error}
          </p>
        )}
      </div>

      {showPopup && (
        <div className="h-screen w-full bg-black/10 fixed top-0 left-0 flex justify-center items-center  z-9999 backdrop-blur-sm">
          <div className="bg-white w-2/6 p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold  flex items-center gap-2">
                Add New {popupFor === "category" ? "Category" : "Subcategory"}
              </h2>{" "}
              <div onClick={() => setShowPopup(false)}>
                <Plus className="w-6 h-6 rotate-45" />
              </div>
            </div>

            <div className="grid grid-cols-1  gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setData({ ...data, image: e.target.files[0] })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-3 mt-2 flex justify-center items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add {popupFor === "category" ? "Category" : "Subcategory"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Dropdown */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Subcategory <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedSubcategoryId}
          onChange={handleSubcategoryChange}
          disabled={disabled || !selectedCategoryId || subcategoriesLoading}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-800"
          required
        >
          <option value="">
            {!selectedCategoryId
              ? "Please select a category first"
              : subcategoriesLoading
              ? "Loading subcategories..."
              : subcategories.length === 0
              ? "No subcategories available"
              : "Select a subcategory"}
          </option>
          {Array.isArray(subcategories) &&
            subcategories?.length > 0 &&
            subcategories.map(
              (subcategory) =>
                subcategory &&
                subcategory._id && (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name ?? "Unnamed Subcategory"}
                  </option>
                )
            )}
          <option value={"add-new-category"} className="text-blue-500">
            <Plus /> Add New Subcategory
          </option>
        </select>
        {subcategoriesError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            Error loading subcategories: {subcategoriesError}
          </p>
        )}
      </div>
    </div>
  );
}
