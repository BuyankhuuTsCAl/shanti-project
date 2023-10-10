/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
//
import {
  PostgrestSingleResponse,
  PostgrestError,
  createClient,
} from '@supabase/supabase-js';
import { Product } from '../schema/schema';

// Replace these with your Supabase project URL and API key
const supabaseUrl = 'https://raqpvvgsmwarxhaialcz.supabase.co'
const supabaseApiKey = process.env.SUPABASE_KEY

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseApiKey ?? '');

export async function fetchProducts(): Promise<
  PostgrestSingleResponse<Product[]> | { data: never[]; error: PostgrestError }
> {
  try {
    const { data: products, error } = await supabase
      .from('Product')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching data:', error);
      return { data: [], error };
    }

    return products;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function fetchProductByName(
  productName: string,
): Promise<PostgrestSingleResponse<Product>> {
  try {
    const { data: product, error } = await supabase
      .from('Product')
      .select('*')
      .eq('name', productName)
      .single();

    if (error) {
      console.error('Error fetching product data:', error);
    }

    return product;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
