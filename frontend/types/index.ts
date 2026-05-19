export interface CheckPhoto {
  angle: string;
  url: string;
}

export interface CheckResult {
  check_id: string;
  category: string;
  label: string;
  result: "pass" | "fail" | "warning" | "skipped";
  confidence: number;
  notes: string;
  photo_angle: string;
}

export interface AuthCheck {
  id: string;
  brand: string;
  model: string;
  colorway: string;
  photos: CheckPhoto[];
  results: CheckResult[];
  overall_verdict: "authentic" | "fake" | "inconclusive" | "pending";
  verdict_confidence: number;
  verdict_summary: string;
  processing_status: "pending" | "processing" | "complete" | "failed";
  // Condition & image authenticity
  condition?: "new" | "like-new" | "lightly-used" | "moderately-used" | "heavily-worn";
  image_authenticity_score?: number;
  // Risk & consistency scores (computed by AI, now surfaced to UI)
  risk_score?: number;
  consistency_score?: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  tier: "free" | "premium";
  checks_today: number;
}

export interface Brand {
  slug: string;
  name: string;
  models: string[];
}
