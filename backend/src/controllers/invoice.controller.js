import Invoice from '../models/invoice.model.js';

export const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching invoices", error });
    }
}

export const getUserInvoices = async (req, res) => {
    try {
        const { _id } = req.params;
        const invoices = await Invoice.find({ user_id: _id }).sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user invoices", error });
    }
}

export const addInvoice = async (req, res) => {
    try {
        const { _id } = req.params;
        const invoiceData = req.body;

        if (_id && _id !== "undefined") {
            // Try to find existing invoice
            const existingInvoice = await Invoice.findById(_id);
            if (existingInvoice) {
                // Add cart item to existing invoice
                if (invoiceData.cart && Array.isArray(invoiceData.cart) && invoiceData.cart.length > 0) {
                    existingInvoice.cart.push(...invoiceData.cart);
                } else if (invoiceData.cart) {
                    existingInvoice.cart.push(invoiceData.cart);
                }
                await existingInvoice.save();
                return res.status(200).json(existingInvoice);
            }
        }
        // If _id is not provided or invoice not found, create new invoice
        const newInvoice = new Invoice(invoiceData);
        await newInvoice.save();
        return res.status(201).json(newInvoice);
    } catch (error) {
        res.status(500).json({ message: "Error adding invoice", error });
    }
}

export const updateInvoice = async (req, res) => {
    try {
        const { _id, cart_id } = req.params;
        const updatedData = req.body;
        const updatedInvoice = await Invoice.findByIdAndUpdate(_id, updatedData, { new: true });
        if (!updatedInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: "Error updating invoice", error });
    }
}

export const deleteInvoice = async (req, res) => {
    try {
        const { _id, cart_id } = req.params;
        if (cart_id) {
            // Find the invoice first to check cart length
            const invoice = await Invoice.findById(_id);
            if (!invoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }
            if (!invoice.cart || invoice.cart.length === 0) {
                return res.status(404).json({ message: "Cart is already empty" });
            }
            // If only one item, delete the invoice
            if (invoice.cart.length === 1) {
                await Invoice.findByIdAndDelete(_id);
                return res.status(200).json({ message: "Invoice deleted successfully (cart was last item)" });
            }
            // Remove a cart item from the invoice's cart array
            const updatedInvoice = await Invoice.findByIdAndUpdate(
                _id,
                { $pull: { cart: { _id: cart_id } } },
                { new: true }
            );
            if (!updatedInvoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }
            // If cart is now empty after removal, delete the invoice
            if (!updatedInvoice.cart || updatedInvoice.cart.length === 0) {
                await Invoice.findByIdAndDelete(_id);
                return res.status(200).json({ message: "Invoice deleted successfully (cart is now empty)" });
            }
            return res.status(200).json({ message: "Cart item deleted successfully", invoice: updatedInvoice });
        } else {
            // Delete the whole invoice
            const deletedInvoice = await Invoice.findByIdAndDelete(_id);
            if (!deletedInvoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }
            return res.status(200).json({ message: "Invoice deleted successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting invoice", error });
    }
}

