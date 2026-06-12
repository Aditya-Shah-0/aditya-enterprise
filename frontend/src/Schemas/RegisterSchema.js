import { z } from "zod";

export const RegisterSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    phone: z.string().min(10, "Phone Number must be at least 10 characters long"),
    panNumber: z.string().min(10, "Pan Number must be at least 10 characters long"),
});