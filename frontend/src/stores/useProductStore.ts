import { create } from "zustand";
import { Product } from "../data-types/product.type";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

interface ProductStore {
    isCreatingProduct: boolean;
    isUpdatingProduct: boolean;
    isDeletingProduct: boolean;
    isFetchingProducts: boolean;
    isFetchingProduct: boolean;

    getProductImages: (product_id: string, ids: string[]) => Promise<void>;
    createProduct: (data: FormData) => Promise<Product | null>;
    updateProduct: (_id:string,form: FormData) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    fetchProducts: () => Promise<void>;
    fetchProduct: (productId: string, setSelectedProduct: (product: Product) => void) => Promise<void>;
    getImage: (fileId: string) => Promise<File | null>;

    allProducts: Product[] | null;
}

export const useProductStore = create<ProductStore>((set) => ({
    isCreatingProduct: false,
    isUpdatingProduct: false,
    isDeletingProduct: false,
    isFetchingProducts: false,
    isFetchingProduct: false,

    allProducts: null,

    createProduct: async (form: FormData) => {
        set({ isCreatingProduct: true });
        try {
            const res = await axiosInstance.post<Product>("/products/create-product", form);
            if (res.status >= 200 && res.status < 300) {
                toast.success("Product created successfully");
            }
            return res.data;
        } catch (error) {
            console.error("Error creating product:", error);
            toast.error("Failed to create product");
            return null;
        } finally {
            set({ isCreatingProduct: false });
        }
    },

    updateProduct: async (_id:string,form: FormData) => {
        set({ isUpdatingProduct: true });
        try {
            const res = await axiosInstance.put<Product>(`/products/update-product/${_id}`, form);
            if (res.status >= 200 && res.status < 300) {
                toast.success("Product updated successfully");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product");
        } finally {
            set({ isUpdatingProduct: false });
        }
    },

    deleteProduct: async (productId: string) => {
        set({ isDeletingProduct: true });
        try {
            const res = await axiosInstance.delete(`/products/delete-product/${productId}`);
            if (res.status >= 200 && res.status < 300) {
                toast.success("Product deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        } finally {
            set({ isDeletingProduct: false });
        }
    },

    getProductImages: async (product_id: string, ids: string[]) => {

        try {
            const response = await axiosInstance.post<[]>("/images/get-images", { ids });
            set((state) => ({
                allProducts: state.allProducts
                    ? state.allProducts.map((p) =>
                        p._id === product_id
                            ? {
                                ...p,
                                appearance: {
                                    ...p.appearance,
                                    images_src: response.data
                                }
                            }
                            : p
                    )
                    : null
            }));
            console.log("Product images fetched successfully");
            // handle response.data if needed, but do not return
        } catch (error) {
            console.error("Error fetching product images:", error);
            console.log("Failed to fetch product images");
        } 
    },
    getImage: async (fileId: string) => {
      try {
        console.log("File ID in getImage: ", fileId);
        const res = await axiosInstance.get(`/images/get-image/${fileId}`);
        return res.data;
      } catch (error) {
        console.log("Error in getImage:", error);
        return null;
      }
    },

    fetchProducts: async () => {
        set({ isFetchingProducts: true });
        try {
            const response = await axiosInstance.get<Product[]>("/products/all-products");
            set({ allProducts: response.data });
            console.log("Products fetched successfully");
        } catch (error) {
            console.error("Error fetching products:", error);
            console.log("Failed to fetch products");
        } finally {
            set({ isFetchingProducts: false });
        }
    },

    fetchProduct: async (productId: string, setSelectedProduct: (product: Product) => void) => {
        set({ isFetchingProduct: true });
        try {
            const response = await axiosInstance.get<Product>(`/products/${productId}`);
            setSelectedProduct(response.data);
        } catch (error) {
            console.error("Error fetching product:", error);
            console.log("Failed to fetch product");
        } finally {
            set({ isFetchingProduct: false });
        }
    },
}));
