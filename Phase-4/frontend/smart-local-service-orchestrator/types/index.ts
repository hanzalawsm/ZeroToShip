export type Category = 'plumber' | 'electrician' | 'carpenter' | 'painter' | 'cleaner';

export type NeighborhoodZone = 
  | 'Gulshan' 
  | 'Johar' 
  | 'Clifton' 
  | 'DHA' 
  | 'Nazimabad' 
  | 'North Nazimabad' 
  | 'PECHS' 
  | 'Malir';

export interface Provider {
  provider_id: number;
  name: string;
  category: Category;
  neighborhood_zone: NeighborhoodZone;
  rating: number;
  review_count: number;
  response_time: string; // e.g. "15 mins"
  completion_rate: number; // e.g. 98
  hourly_rate: string; // e.g. "PKR 1,500/hr"
  experience_years: number;
  verified: boolean;
  avatar_url: string;
  specialities: string[];
  phone: string;
  available_now: boolean;
}

export interface ExtractedIntent {
  service: Category | null;
  location: NeighborhoodZone | null;
  time: string | null;
  confidence: number;
  raw_prompt: string;
}

export interface AIReasoning {
  top_provider_id: number;
  summary: string;
  key_factors: string[];
  alternative_count: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: string;
  text: string;
  isProcessing?: boolean;
  extractedIntent?: ExtractedIntent;
  matchedProviders?: Provider[];
  aiReasoning?: string;
}

export interface BookingState {
  provider: Provider | null;
  user_name: string;
  booking_time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}
