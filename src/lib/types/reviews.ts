export interface TripReviewItem {
  id: string;
  reviewerName: string;
  rating: number;
  title: string;
  reviewText: string;
  photoUrls: string[];
  hotelRating?: number;
  activityRating?: number;
  guideRating?: number;
  createdAt: string;
}

export interface ReviewSubmissionPayload {
  packageFamilyId: string;
  bookingId?: string;
  reviewerName: string;
  rating: number;
  title: string;
  reviewText: string;
  photoUrls?: string[];
  hotelRating?: number;
  activityRating?: number;
  guideRating?: number;
}
