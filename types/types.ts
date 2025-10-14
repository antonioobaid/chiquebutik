
// fil: types/types.ts
export interface Product {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  category: string
  size: string
  color: string
  in_stock: boolean
  created_at: string
  cartId?: string;
}

// types/types.ts
export interface ContactInfo {
  id: number;             // bigint i Supabase → number i TS
  company: string;        // ändrat från company_name → company
  address: string;
  phone: string;
  opening_hours: string;
  created_at: string;     // timestamptz → string
}

