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
