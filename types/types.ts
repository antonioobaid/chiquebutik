// fil: types/types.ts

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  size: string;
  color: string;
  in_stock: boolean;
  created_at: string;
  stripe_price_id?: string;   
  stripe_product_id?: string;  
}


export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  created_at: string;  // ISO timestamp
  user_id: string;
  products?: Product;  
}


export interface ContactInfo {
  id: number;            // bigint i Supabase → number
  company: string;
  address: string;
  phone: string;
  opening_hours: string;
  created_at: string;  
   email?: string; 
}


export interface Favorite {
  id: number;            // bigint i Supabase → number
  created_at: string;    // timestamptz → string
  user_id: string;       // uuid i Supabase → string
  product_id: number;    // bigint → number (matchar Product.id)
}




// fil: types/types.ts
export interface Order {
  id: number;
  user_id: string | null;
  stripe_session: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}




