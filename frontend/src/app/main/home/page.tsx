"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "../../../stores/useProductStore";
import { useSelectedModeStore } from "../../../stores/useSelectedModeStore";
import ProductItem from "./product-item";

export default function SublimationPrintScreen() {
const {allProducts, isFetchingProducts} = useProductStore();
  const { search } = useSelectedModeStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;

  const filteredTickets = useMemo(() => {
    return (
      allProducts?.filter((pro) => {
        const searchLower = search.toLowerCase();
        // Defensive: check if pro.general and fields exist before calling toLowerCase
        const category = pro?.general?.category ?? "";
        const subCategory = pro?.general?.sub_category ?? "";
        return (
          (typeof category === "string" && category.toLowerCase().includes(searchLower)) ||
          (typeof subCategory === "string" && subCategory.toLowerCase().includes(searchLower))
        );
      }) || []
    );
  }, [allProducts, search]);
    

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTickets?.slice(startIndex, endIndex);
  }, [filteredTickets, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil((filteredTickets?.length || 0) / itemsPerPage);
  }, [filteredTickets]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen items-center px-4 bg-gradient-to-br from-stone-400 via-stone-100 to-stone-300 pt-16 flex flex-col"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <motion.div className="max-w-7xl w-full flex flex-col items-center justify-center mt-5 pb-20">
          <h2 className="text-2xl font-bold mb-4 text-stone-700">
            {search === "" ? "All Products" : search}
          </h2>
          <div className="px-2 mb-4 flex items-center justify-center align-middle w-full">
          <input
            type="search"
            className="max-w-5xl  w-full bg-white mb-7 text-center py-2 placeholder:text-sm rounded-full border border-stone-600 outline-none shadow-lg shadow-neutral-600"
            placeholder="Search by Category, design, date expected etc..."
            onChange={(e) => useSelectedModeStore.setState({search:e.target.value})}
          />
          </div>
          {isFetchingProducts ? (
            <div className="flex gap-x-2 items-center justify-center align-middle">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></span>
              <p className="text-gray-500">Loading your products...</p>
            </div>
          ) : paginatedTickets?.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage} // Ensure animation triggers on page change
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {paginatedTickets?.map((product) => (
                  <ProductItem key={product._id} product={product}/> // Assuming you have a ProductItem component
                ))}
              </motion.div>
            </AnimatePresence>
          )}
          {(filteredTickets?.length ?? 0) > itemsPerPage && (
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}