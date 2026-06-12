import { z } from "zod";

export const AccountSchema = z.object({
    ownerName: z.string().min(8, "Owner name must be at least 8 characters long").regex(/^[a-zA-Z ]+$/, "Owner name can only contain alphabets and spaces"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must not exceed 15 digits").regex(/^[0-9]+$/, "Phone number must contain only digits"),
})