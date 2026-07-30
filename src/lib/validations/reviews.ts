import { z } from 'zod';

export const reviewSubmissionSchema = z.object({
  packageFamilyId: z.string().uuid(),
  reviewerName: z.string().min(2, 'Name is required'),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().min(3, 'Review title must be at least 3 characters'),
  reviewText: z.string().min(10, 'Review description must be at least 10 characters'),
  hotelRating: z.coerce.number().min(1).max(5).optional(),
  activityRating: z.coerce.number().min(1).max(5).optional(),
  guideRating: z.coerce.number().min(1).max(5).optional(),
});

export type ReviewSubmissionValues = z.infer<typeof reviewSubmissionSchema>;
