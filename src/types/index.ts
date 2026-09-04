export type ExperienceType = 'beach' | 'adventure' | 'culture' | 'cruise';
export type BudgetTier = 'under-700' | '700-1000' | 'over-1000';

export interface CategoryItem {
  id: string;
  label: string;
  labelEn?: string;
  fullLabel: string;
  emoji: string;
}

export interface Destination {
  id: string;
  title: string;
  titleEn?: string;
  tagline: string;
  taglineEn?: string;
  category: string;
  experienceType: ExperienceType;
  budgetTier: BudgetTier;
  priceNumeric: number;
  priceEstimate: string;
  priceEstimateEn?: string;
  initialPayment: string;
  initialPaymentEn?: string;
  duration: string;
  durationEn?: string;
  image: string;
  images?: string[];
  isResort?: boolean;
  pricePerNight?: string;
  roomType?: string;
  badge?: string;
  badgeEn?: string;
  departure: string;
  departureEn?: string;
  visaRequirement: string;
  visaRequirementEn?: string;
  description: string;
  descriptionEn?: string;
  highlights: string[];
  highlightsEn?: string[];
  includes: string[];
  includesEn?: string[];
  itinerarySummary: { day: string; activity: string; activityEn?: string }[];
}

export type TestimonialStatus = 'approved' | 'pending' | 'declined';

export interface Testimonial {
  id: string;
  name: string;
  lastname: string;
  city: string;
  destination: string;
  date: string;
  quote: string;
  story: string;
  avatar: string;
  vacationPhoto?: string;
  rating: number;
  highlightTag: string;
  status?: TestimonialStatus;
  createdAt?: number;
}

export interface ReviewSubmission {
  name: string;
  lastname: string;
  origin: string;
  destination: string;
  highlightTag: string;
  quote: string;
  comment: string;
  rating: number;
  avatar?: string;
  vacationPhoto?: string;
}

export interface TripInquiry {
  destination: string;
  departureCity: string;
  travelers: string;
  month: string;
  budgetStyle: string;
  notes: string;
}
