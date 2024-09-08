import { z } from 'zod';

export const websiteDataSchema = z.object({
  websiteLogo:
    z.string()
    .optional()
      .nullable(),
  websiteName: z.string()
    .min(1, 'Website name cannot be empty')
    .max(50, 'Website name cannot be longer than 50 characters')
    .default('Untitled'),
  websitePrimaryColor: z.string()
    .default('#ffffff'),
  websiteSecondaryColor: z.string()
    .default('#725f2')
})