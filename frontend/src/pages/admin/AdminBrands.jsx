import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";
import Loading from "../../components/common/Loading";

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
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
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getBrands();
      setBrands(response.data.data?.data || response.data.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
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
        await adminApi.updateBrand(editingId, data);
        alert("Brand updated successfully!");
      } else {
        await adminApi.createBrand(data);
        alert("Brand created successfully!");
      }

      setFormData({ name: "", description: "", status: true, image: null });
      setEditingId(null);
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      console.log("FULL RESPONSE:", error.response?.data);
      console.log("VALIDATION ERRORS:", error.response?.data?.errors);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          Object.entries(errors).forEach(([field, messages]) => {
            console.log(`${field}:`, messages);
          });
          alert(Object.values(errors).flat().join("\n"));
        } else {
          alert(error.response.data.message || "Validation failed");
        }
      } else {
        alert(
          error.response?.data?.message ||
            "Something went wrong while saving the brand.",
        );
      }
    } finally {
      setSaving(false);
    }

    //   alert(
    //     error.response?.data?.message ||
    //       "Something went wrong while saving the brand.",
    //   );
    // }
    // catch (error) {
    //   console.error('Error saving brand:', error);
    //   if (error.response?.data?.errors) {
    //     setErrors(error.response.data.errors);
    //   } else {
    //     alert(error.response?.data?.message || 'Failed to save brand.');
    //   }
    // } finally {
    //   setSaving(false);
    // }
  };

  const handleEdit = (brand) => {
    setEditingId(brand.id);
    setFormData({
      name: brand.name || "",
      description: brand.description || "",
      status: brand.status ?? true,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      await adminApi.deleteBrand(id);
      alert("Brand deleted successfully!");
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", status: true, image: null });
    setErrors({});
  };

  if (loading) {
    return <Loading message="Loading brands..." />;
  }

  return (
    <div>
      <h2 className="mb-4">Brands</h2>

      {/* Brand Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h6 className="card-title mb-3">
            {editingId ? "Edit Brand" : "Add New Brand"}
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
                    "Update Brand"
                  ) : (
                    "Add Brand"
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

      {/* Brands Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {brands.length > 0 ? (
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
                  {brands.map((brand) => (
                    <tr key={brand.id}>
                      <td>
                        <img
                          src={
                            brand.image_url ||
                            "/images/no-image.svg"
                          }
                          alt={brand.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          className="rounded"
                        />
                      </td>
                      <td>{brand.name}</td>
                      <td>{brand.description || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${brand.status === "active" ? "bg-success" : "bg-secondary"}`}
                        >
                          {brand.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-1"
                          onClick={() => handleEdit(brand)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(brand.id)}
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
              <i className="bi bi-building fs-2"></i>
              <p className="mb-0">No brands found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBrands;
