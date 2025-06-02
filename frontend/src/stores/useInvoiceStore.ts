import { Invoice } from "@/data-types/invoice.type";
import { axiosInstance } from "@/libs/axios";
import toast from "react-hot-toast";
import { create } from "zustand";


interface InvoiceState {
    isAddingInvoice: boolean;
    isUpdatingInvoice: boolean;
    isRemovingInvoice: boolean;
    isGettingAllInvoices: boolean;
    isGettingUserInvoices: boolean;
    allInvoices: Invoice[];

    addInvoice: (invoice: Invoice) => void;
    updateInvoice: (invoice: Invoice) => void;
    removeInvoice: (id: string,product_id:string) => void;
    getAllInvoices: () => void;
    getUserInvoices: (userId: string) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
    isAddingInvoice: false,
    isUpdatingInvoice: false,
    isRemovingInvoice: false,
    isGettingAllInvoices: false,
    isGettingUserInvoices: false,
    
    allInvoices: [],

    getAllInvoices: async () => {
        set({ isGettingAllInvoices: true });
        try {
            const res = await axiosInstance.get<Invoice[]>("/invoices/get-all-invoices");
            if (res.status !== 200 && res.status !== 201) {
                toast.error("Failed to fetch invoices");
                set({ isGettingAllInvoices: false });
                return;
            }
            set({ allInvoices: res.data });
        } catch {
            toast.error("Failed to fetch invoices");
        } finally {
            set({ isGettingAllInvoices: false });
        }
    },

    getUserInvoices: async (userId) => {
        set({ isGettingUserInvoices: true });
        try {
            const res = await axiosInstance.get<Invoice[]>(`/invoices/get-user-invoices/${userId}`);
            if (res.status !== 200 && res.status !== 201) {
                toast.error("Failed to fetch user invoices");
                set({ isGettingUserInvoices: false });
                return;
            }
            set({ allInvoices: res.data });
        } catch {
            toast.error("Failed to fetch user invoices");
        } finally {
            set({ isGettingUserInvoices: false });
        }
    },

    addInvoice: async (invoice) => {
        set({ isAddingInvoice: true });
        try {
            const res = await axiosInstance.post<Invoice>(`/invoices/add-invoice/${invoice._id}`, invoice);
            if (res.status !== 200 && res.status !== 201) {
                toast.error("Failed to add invoice");
                set({ isAddingInvoice: false });
                return;
            }
            else {
                set((state) => ({ allInvoices: [...state.allInvoices, res.data] }));
                toast.success("Invoice added successfully");
            }
        } catch {
            toast.error("Failed to add invoice");
        } finally {
            set({ isAddingInvoice: false });
        }
    },

    updateInvoice: async (invoice) => {
        set({ isUpdatingInvoice: true });
        try {
            const res = await axiosInstance.put<Invoice>(`/invoices/update-invoice/${invoice._id}`, invoice);
            if (res.status !== 200 && res.status !== 201) {
                toast.error("Failed to update invoice");
                set({ isUpdatingInvoice: false });
                return;
            }
            else {
                set((state) => ({
                    allInvoices: state.allInvoices.map((inv) =>
                        inv._id === invoice._id ? res.data : inv
                    ),
                }));
                toast.success("Invoice updated successfully");
            }
        } catch {
            toast.error("Failed to update invoice");
        } finally {
            set({ isUpdatingInvoice: false });
        }
    },

    removeInvoice: async (id,product_id) => {
        set({ isRemovingInvoice: true });
        try {
            const res = await axiosInstance.delete(`/invoices/delete-invoice/${id}/${product_id}`);
            if (res.status !== 200 && res.status !== 201) {
                toast.error("Failed to remove invoice");
                set({ isRemovingInvoice: false });
                return;
            } else {
                set((state) => ({
                    allInvoices: state.allInvoices.filter((invoice) => invoice._id !== id),
                }));
                toast.success("Invoice removed successfully");
            }
        } catch {
            toast.error("Failed to remove invoice");
        } finally {
            set({ isRemovingInvoice: false });
        }
    },
}));
