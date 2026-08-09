export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}

export interface UserResponse {
  user_id: number;
  name: string;
  email: string;
}

export interface UserProfileResponse extends UserResponse {
  phone: string | null;
  avatar_url: string | null;
}

export interface UserProfileUpdate {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface ProviderResponse {
  provider_id: number;
  name: string;
  category: string;
  neighborhood_zone: string;
  rating: number;
  review_count: number;
  response_time: string | null;
  completion_rate: number;
  hourly_rate: string | null;
  experience_years: number | null;
  verified: boolean;
  avatar_url: string | null;
  specialities: string[];
  phone: string | null;
  available_now: boolean;
}

export interface BookingCreate {
  provider_id: number;
  booking_time: string;
}

export interface BookingResponse {
  booking_id: number;
  user_id: number;
  user_name: string;
  provider: ProviderResponse;
  booking_time: string;
  status: string;
}

export interface ExtractedIntent {
  service: string | null;
  location: string | null;
  time: string | null;
  confidence: number;
  raw_prompt: string;
}

export interface AIReasoning {
  top_provider_id: number | null;
  summary: string;
  key_factors: string[];
  alternative_count: number;
}

export interface OrchestrateResponse {
  intent: ExtractedIntent;
  top_provider: ProviderResponse | null;
  all_matches: ProviderResponse[];
  aiReasoning: AIReasoning;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  timestamp: string;
  text: string;
  extractedIntent?: ExtractedIntent;
  aiReasoning?: AIReasoning;
  matchedProviders?: ProviderResponse[];
}
