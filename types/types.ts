// types/types.ts

export interface ProductSize {
  id: number;
  product_id: number;
  size: string;
  in_stock: boolean;
  created_at: string; // timestamp → string
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_order: number;
  image_url: string;
  created_at: string; // timestamp → string
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number; // numeric → number
  image_url: string;
  category: string;
  color: string;
  created_at: string;
  stripe_price_id?: string;
  stripe_product_id?: string;
  sizes?: ProductSize[];        // Mappas från product_sizes
  product_sizes?: ProductSize[]; // Supabase response
  images?: ProductImage[];       // För frontend
  product_images?: ProductImage[]; // Supabase response
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  size?: string;
  created_at: string;
  user_id: string;
  products?: Product;
}

export interface Favorite {
  id: number;
  created_at: string;
  user_id: string;
  product_id: number;
}

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

export interface ContactInfo {
  id: number;
  company: string;
  address: string;
  phone: string;
  opening_hours: string;
  created_at: string;
  email?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}
