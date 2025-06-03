"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "../../../stores/useProductStore";
import { useSelectedModeStore } from "../../../stores/useSelectedModeStore";
import ProductItem from "./product-item";
import UnauthorizedLoginFirstModal from "../../../components/UnauthorizedLoginFirstModal";
import { useNavigate } from "react-router-dom";

export default function HomeScreen() {
  const { allProducts, isFetchingProducts } = useProductStore();
  const { search } = useSelectedModeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;
  const navigate = useNavigate();
  const [isUnauthorizedModalOpen, setUnauthorizedModalOpen] = useState(false);

  // Filter products by search
  const filteredProducts = useMemo(() => {
    const searchLower = search.toLowerCase();
    return (
      allProducts?.filter((pro) => {
        const category = pro?.general?.category ?? "";
        const subCategory = pro?.general?.sub_category ?? "";
        return (
          (typeof category === "string" &&
            category.toLowerCase().includes(searchLower)) ||
          (typeof subCategory === "string" &&
            subCategory.toLowerCase().includes(searchLower))
        );
      }) || []
    );
  }, [allProducts, search]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <>
      <title>Lunga Traders | Home</title>
      <AnimatePresence mode="wait">
        <motion.div
          className="min-h-screen items-center px-4 bg-gradient-to-br from-stone-400 via-stone-100 to-stone-300 pt-16 flex flex-col"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="max-w-7xl w-full flex flex-col items-center justify-center mt-5 pb-20">
            <h2 className="text-2xl font-bold mb-4 text-stone-700">
              {search === "" ? "All Products" : search}
            </h2>
            <div className="px-2 mb-4 flex items-center justify-center align-middle w-full">
              <input
                type="search"
                className="max-w-5xl w-full bg-white mb-7 text-center py-2 placeholder:text-sm rounded-full border border-stone-600 outline-none shadow-lg shadow-neutral-600"
                placeholder="Search by Category, design, date expected etc..."
                value={search}
                onChange={(e) =>
                  useSelectedModeStore.setState({ search: e.target.value })
                }
              />
            </div>
            {isFetchingProducts ? (
              <div className="flex gap-x-2 items-center justify-center align-middle">
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></span>
                <p className="text-gray-500">Loading your products...</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <p className="text-gray-500">No products found.</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`page-${currentPage}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="flex flex-wrap items-center justify-center gap-2"
                >
                  {paginatedProducts.map((product, idx) => (
                    <ProductItem
                      key={
                        product._id && product._id.trim() !== ""
                          ? product._id
                          : `product-${product.general?.make || "make"}-${
                              product.general?.model || "model"
                            }-${product.general?.category || "cat"}-${idx}`
                      }
                      product={product}
                      setUnauthorizedModalOpen={setUnauthorizedModalOpen}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
            {filteredProducts.length > itemsPerPage && (
              <div className="flex items-center justify-center mt-6 gap-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <UnauthorizedLoginFirstModal
          isOpen={isUnauthorizedModalOpen}
          message="You are not allowed to Add to Cart. To be able to be allowed. Login first (or create account if do not have and login)"
          title="Unauthurized User"
          onClose={() => setUnauthorizedModalOpen(false)}
          onConfirm={() => navigate("/login")}
        />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
