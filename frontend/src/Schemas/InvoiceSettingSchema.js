import { z } from "zod";
const tempeleteIds = ['standard', 'table', 'bold', 'rounded'];
const themeColors = ['#2563EB', '#DC2626', '#16A34A', '#9333EA', '#000000'];

export const invoiceSettingSchema = z.object({
    templateId: z.enum(tempeleteIds, { required_error: "Template is required" }),
    themeColor: z.enum(themeColors, { required_error: "Theme color is required" }),
    showLogo: z.boolean(),
    showBusinessName: z.boolean(),
    showCompanyAddress: z.boolean(),
    showItemDescription: z.boolean(),
    showSignature: z.boolean(),
    customFooterText: z.string().min(1, "Custom footer text is required").max(100, "Custom footer text must be at most 100 characters long"),
});