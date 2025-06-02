import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCourseCategory ,createSubCategory} from "../store/slices/courseCategorySlice";
import type { AppDispatch, RootState } from "../store";
import toast, { Toaster } from "react-hot-toast";

interface SubCategoryInput {
  name: string;
  slug: string;
}

export default function AddCategory() {
  const [category, setCategory] = useState({
    name: "",
    slug: "",
    status: "active",
    image: null as File | null,
  });
  const [addSubcategory, setAddSubcategory] = useState(false);
  const [subcategories, setSubcategories] = useState<SubCategoryInput[]>([]);
 

  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.courseCategory.loading);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
 
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCategory({ ...category, image: e.target.files[0] });
   
    }
  };

  const handleAddSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddSubcategory(e.target.checked);
    if (e.target.checked) {
      setSubcategories([{ name: "", slug: "" }]);
    } else {
      setSubcategories([]);
    }
  };

  const handleSubcategoryChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSubcategories = [...subcategories];
    const key = e.target.name as keyof SubCategoryInput;
    newSubcategories[index][key] = e.target.value;
    setSubcategories(newSubcategories);
  };

  const addSubcategoryField = () => {
    setSubcategories([...subcategories, { name: "", slug: "" }]);
  };

  const removeSubcategoryField = (index: number) => {
    const newSubcategories = subcategories.filter((_, i) => i !== index);
    setSubcategories(newSubcategories);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!category.name) {
    toast.error("Category name is required.", {
      duration: 8000,
      position: 'top-right',
    });
    return;
  }
  if (!category.slug) {
    toast.error("Slug is required.", {
      duration: 8000,
      position: 'top-right',
    });
    return;
  }

  const formData = new FormData();
  formData.append("name", category.name);
  formData.append("slug", category.slug);
  formData.append("status", category.status);
  if (category.image) {
    formData.append("image", category.image);
  }

  // Append subcategories as JSON string if needed
  if (addSubcategory && subcategories.length > 0) {
    formData.append("subcategories", JSON.stringify(subcategories));
  }

  try {
    // Now just dispatch createCourseCategory with formData
    await dispatch(createCourseCategory(formData) as any).unwrap();

    toast.success('Category created successfully! 🎉', {
      duration: 8000,
      position: 'top-right',
    });
    setCategory({ name: "", slug: "", status: "active", image: null });
    setSubcategories([]);
    setAddSubcategory(false);
  } catch (err: any) {
    toast.error(err?.message || "Failed to create category.", {
      duration: 8000,
      position: 'top-right',
    });
  }
};


  return (
    <div>
      <Toaster position="top-right" />
      <PageMeta
        title="Add Category | TailAdmin"
        description="Add a new category page for TailAdmin"
      />
      <PageBreadcrumb pageTitle="Add Category" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full ">
          <h3 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Add New Category
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Fields */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={category.name}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Enter category name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={category.slug}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Enter category slug"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A unique identifier for the category (e.g., 'electronics').
              </p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                name="status"
                value={category.status}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              {category.image && typeof category.image !== 'string' && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(category.image)}
                    alt="Category Preview"
                    className="max-w-xs h-auto rounded"
                  />
                </div>
              )}
            </div>

            {/* Add Subcategory Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="addSubcategory"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
                checked={addSubcategory}
                onChange={handleAddSubcategoryChange}
              />
              <label
                htmlFor="addSubcategory"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Add Subcategory
              </label>
            </div>

            {/* Subcategory Fields */}
            {addSubcategory && (
              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Subcategories
                </h4>
                {subcategories.map((subcategory, index) => (
                  <div key={index} className="space-y-2 border border-gray-200 rounded-md p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h5 className="text-md font-medium text-gray-700 dark:text-gray-300">
                        Subcategory #{index + 1}
                      </h5>
                      {subcategories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubcategoryField(index)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subcategory Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={subcategory.name}
                        onChange={(e) => handleSubcategoryChange(index, e)}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        placeholder="Enter subcategory name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subcategory Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={subcategory.slug}
                        onChange={(e) => handleSubcategoryChange(index, e)}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        placeholder="Enter subcategory slug"
                        required
                      />
                    </div>
                  </div>
                ))}
                {addSubcategory && (
                  <button
                    type="button"
                    onClick={addSubcategoryField}
                    className="rounded bg-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-400 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Add Another Subcategory
                  </button>
                )}
              </div>
            )}

       
            {/* Submit Button */}
            <button
              type="submit"
              className="rounded bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
