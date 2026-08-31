import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";
import Loading from "../../components/common/Loading";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getCategories();
      setCategories(response.data.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData[key]) {
          data.append(key, formData[key]);
        } else if (key === "status") {
          data.append(key, formData[key] ? "1" : "0");
        } else if (key !== "image") {
          data.append(key, formData[key]);
        }
      });

      if (editingId) {
        data.append("_method", "PUT");
        await adminApi.updateCategory(editingId, data);
        alert("Category updated successfully!");
      } else {
        await adminApi.createCategory(data);
        alert("Category created successfully!");
      }

      setFormData({ name: "", description: "", status: true, image: null });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving brand:", error);
      console.log("Status:", error.response?.status);
      console.log("Laravel response:", error.response?.data);
      console.log("Validation errors:", error.response?.data?.errors);
      alert(
        error.response?.data?.message ||
          "Validation failed. Check the console.",
      );
    } finally {
      setSaving(false);
    }
    // alert(
    //   error.response?.data?.message ||
    //  "Validation failed. Check the console."
    //);
    //
    // catch (error) {
    //   console.error('Error saving category:', error);
    //   if (error.response?.data?.errors) {
    //     setErrors(error.response.data.errors);
    //   } else {
    //     alert(error.response?.data?.message || 'Failed to save category.');
    //   }
    // } finally {
    //   setSaving(false);
    // }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      status: category.status ?? true,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await adminApi.deleteCategory(id);
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", status: true, image: null });
    setErrors({});
  };

  if (loading) {
    return <Loading message="Loading categories..." />;
  }

  return (
    <div>
      <h2 className="mb-4">Categories</h2>

      {/* Category Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h6 className="card-title mb-3">
            {editingId ? "Edit Category" : "Add New Category"}
          </h6>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="name" className="form-label">
                  Name *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <div className="invalid-feedback">{errors.description}</div>
                )}
              </div>

              <div className="col-md-2 mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="col-md-2 mb-3">
                <label htmlFor="image" className="form-label">
                  Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : editingId ? (
                    "Update Category"
                  ) : (
                    "Add Category"
                  )}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Categories Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {categories.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <img
                          src={
                            category.image_url ||
                            "https://via.placeholder.com/50x50/eee/999?text=No+Image"
                          }
                          alt={category.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          className="rounded"
                        />
                      </td>
                      <td>{category.name}</td>
                      <td>{category.description || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${category.status === "active" ? "bg-success" : "bg-secondary"}`}
                        >
                          {category.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-1"
                          onClick={() => handleEdit(category)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(category.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-grid fs-2"></i>
              <p className="mb-0">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
