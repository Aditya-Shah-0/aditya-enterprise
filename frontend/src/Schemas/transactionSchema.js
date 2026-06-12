import { z } from "zod";

const itemSchema = z.object({
    name: z.string().min(1, { message: "Item name is required" }),
    description: z.string().optional(),
    qty: z.coerce
        .number({ invalid_type_error: "Qty must be a number" })
        .min(1, { message: "Qty must be at least 1" }),
    price: z.coerce
        .number({ invalid_type_error: "Price must be a number" })
        .min(0, { message: "Price cannot be negative" }),
    amount: z.coerce.number().optional(),
});

export const transactionSchema = z.object({
    partyName: z.string().min(1, { message: "Party name is required" }),
    partyAddress: z.string().optional(),
    partyPhone: z.string().optional(),
    invoiceNo: z.string().min(1, { message: "Invoice number is required" }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid due date format",
    }),

    stateOfSupply: z.string().optional(),

    particulars: z
        .array(itemSchema)
        .min(1, {
            message: "Please add at least one item to the invoice"
        }),

    discountPercentage: z.coerce
        .number()
        .min(0)
        .max(100, { message: "Discount cannot exceed 100%" })
        .default(0),

    taxPercentage: z.coerce
        .number()
        .min(0)
        .max(100, { message: "Tax cannot exceed 100%" })
        .default(0),

    subTotal: z.coerce.number().optional(),
    grandTotal: z.coerce.number().optional(),

    term: z.string().optional(),
    paymentMode: z.string().optional(),

    paidAmount: z.coerce
        .number()
        .min(0, { message: "Paid amount cannot be negative" })
        .default(0),

    balance: z.coerce.number().optional(),
    isPaid: z.boolean().optional(),
});