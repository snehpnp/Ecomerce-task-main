import React, { useEffect, useState } from "react";
import {
  addProduct,
  getAllProducts,
  uploadToCloudinary,
  updateProduct,
  deleteProduct,
} from "../../services/ProductService";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 10;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageModal, setImageModal] = useState({ open: false, src: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentProduct, setCurrentProduct] = useState({
    _id: null,
    name: "",
    description: "",
    price: "",
    stock: 1,
    offer_price: "",
    image_url: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data || []);
      setFilteredProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setCurrentProduct({
      _id: null,
      name: "",
      price: "",
      stock: 1,
      description: "",
      offer_price: "",
      image_url: "",
    });
    setImageFile(null);
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsEdit(true);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const val = name === "stock" ? Number(value) : value;
    setCurrentProduct({ ...currentProduct, [name]: val });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = imageFile
        ? await uploadToCloudinary(imageFile)
        : currentProduct.image_url;
      const productData = { ...currentProduct, image_url: imageUrl };
      if (isEdit) {
        await updateProduct(productData);
      } else {
        await addProduct(productData);
      }
      fetchProducts();
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving product", err);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct({ _id: id });
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
          fetchProducts();
        } catch (err) {
          console.error("Error deleting product", err);
          Swal.fire(
            "Error!",
            "There was an error deleting the product.",
            "error"
          );
        }
      }
    });

  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product Management</h2>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="border px-2 py-1 rounded mr-4"
        />
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((prod, i) => (
            <tr key={prod._id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
              </td>
              <td className="p-2 border">{prod.name}</td>
              <td className="p-2 border">{prod.price}</td>
              <td className="p-2 border">{prod.stock}</td>
              <td className="p-2 border">
                {prod.image_url && (
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-16 h-16 object-cover cursor-pointer"
                    onClick={() =>
                      setImageModal({ open: true, src: prod.image_url })
                    }
                  />
                )}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => openEditModal(prod)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prod._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {imageModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded relative">
            <button
              onClick={() => setImageModal({ open: false, src: "" })}
              className="absolute top-1 right-2 text-gray-600 hover:text-red-600"
            >
              &#10005;
            </button>
            <img
              src={imageModal.src}
              alt="Preview"
              className="max-w-full max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={currentProduct.name}
                onChange={handleInputChange}
                className="w-full border p-2"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={currentProduct.price}
                onChange={handleInputChange}
                className="w-full border p-2"
                required
              />
              <input
                type="number"
                name="offer_price"
                placeholder="Offer Price"
                value={currentProduct.offer_price}
                onChange={handleInputChange}
                className="w-full border p-2"
              />
              <select
                name="stock"
                value={currentProduct.stock}
                onChange={handleInputChange}
                className="w-full border p-2"
              >
                <option value="">Select Stock Status</option>
                <option value="1">In Stock</option>
                <option value="0">Out of Stock</option>
              </select>
              <textarea
                name="description"
                placeholder="Short Description"
                value={currentProduct.description}
                onChange={handleInputChange}
                className="w-full border p-2"
                required
              ></textarea>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isEdit ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
