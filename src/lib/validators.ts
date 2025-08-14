
import { z } from 'zod';

export const VisitorIntakeFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  mustHave: z.string().optional(),
  // This field is for AI processing and not directly part of the user form.
  status: z.enum(['Hot Now', 'Researching', 'Just Looking']),
});

export type VisitorIntakeForm = z.infer<typeof VisitorIntakeFormSchema>;
