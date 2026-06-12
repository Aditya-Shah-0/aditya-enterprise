import { z } from "zod";

export const BussinessSetupPageSchema = z.object({
    businessName: z.string().min(3, "Business name must be at least 3 characters long").max(100, "Business name must be at most 100 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 characters long").max(15, "Phone number must be at most 15 characters long"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(10, "Address must be at least 10 characters long").max(500, "Address must be at most 500 characters long"),
    state: z.string().min(3, "State must be at least 3 characters long").max(100, "State must be at most 100 characters long"),
    city: z.string().min(3, "City must be at least 3 characters long").max(100, "City must be at most 100 characters long"),
    pincode: z.string().min(6, "Pincode must be at least 6 digits long").max(6, "Pincode must be at most 6 digits long"),
    isGstRegistered: z.string().optional(),
    businessType: z.string().min(1, "Please select a business type"),
    industryType: z.string().min(1, "Please select an industry type"),
    registrationType: z.string().min(1, "Please select a registration type"),
    gstNumber: z.string().length(15, "GST Number must be 15 digits"),
    panNumber: z.string().length(10, "Pan Number must be 10 digits"),
    bankName: z.string().min(3, "Bank name must be at least 3 characters long").max(100, "Bank name must be at most 100 characters long"),
    accountNumber: z.string().min(10, "Account number must be at least 10 digits").max(20, "Account number too long"),
    ifscCode: z.string().min(8, "IFSC code must be 8 characters").max(11, "IFSC code must be 11 characters"),
    billingCalculationMode: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.isGstRegistered === "true") {
        if (!data.gstNumber || data.gstNumber.length !== 15) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "GST Number is required and must be 15 chars",
                path: ["gstNumber"],
            });
        }
    }
});