export interface Profile {
  id: string
  full_name: string
  username: string
  email_or_phone: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_type: "free" | "pro"
  status: "active" | "inactive" | "expired"
  created_at: string
  expires_at: string | null
}

export interface ChatMessage {
  id: string
  user_id: string
  message: string
  response: string | null
  model_used: "kuenda-2.5" | "kuenda-4.8-pro"
  created_at: string
}
