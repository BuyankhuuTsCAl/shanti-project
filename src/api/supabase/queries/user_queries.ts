/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
//

import {
  PostgrestSingleResponse,
  PostgrestError,
  createClient,
} from '@supabase/supabase-js';
import { User } from '../../../schema/schema';

import { Product } from '../../../schema/schema';

// Replace these with your Supabase project URL and API key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseApiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize the Supabase client
const supabase = createClient(supabaseUrl ?? '', supabaseApiKey ?? '');

export async function fetchUserData(): Promise<
  PostgrestSingleResponse<User[]> | { data: never[]; error: PostgrestError }
> {
  try {
    const { data: users, error } = await supabase.from('profiles').select('*');

    if (error) {
      console.error('Error fetching data:', error);
      return { data: [], error };
    }

    return { data: users } as PostgrestSingleResponse<User[]>;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function fetchUserByUUID(uuid: string) {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', uuid)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
    }

    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUserInfo(product: Product, isFav: Boolean) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user != null) {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', user.id);

    if (data != null) {
      const CurrUserFavoriteItems = data[0].fav_items;

      if (isFav) {
        CurrUserFavoriteItems[product.product_id] = 1;
      } else {
        delete CurrUserFavoriteItems[product.product_id];
      }

      const { error } = await supabase
        .from('profiles')
        .update({ fav_items: CurrUserFavoriteItems })
        .eq('user_id', user.id);
    }
  }
}

export async function arrayOfFavorites() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user != null) {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', user.id)
      .single();

    const CurrUserFavoriteItems = data.fav_items;

    const Favkey = Object.keys(CurrUserFavoriteItems);

    var FavArray = [];

    for (let i = 0; i < Favkey.length; i++) {
      let key = Favkey[i];
      const { data, error } = await supabase
        .from('product')
        .select()
        .eq('product_id', key)
        .single();

      if (data != undefined) {
        FavArray.push(data);
      }
    }

    return FavArray;
  }
}

export async function totalNumberOfItemsInCart() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user != null) {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', user.id)
      .single();

    if (data != null) {
      const CurrUserCart = data.cart;
      console.log(CurrUserCart);
      if (CurrUserCart == null || CurrUserCart.length == 0) {
        return 0;
      } else {
        const itemNumb = Object.values(CurrUserCart) as number[];

        let sum = 0;

        for (let i = 0; i < itemNumb.length; i++) {
          sum = sum + itemNumb[i];
        }

        return sum;
      }
    }
  }
}

export async function getProduct() {
  const { data } = await supabase.from('product').select('*');
  return data;
}

export async function filterProduct(productType: String) {
  const { data } = await supabase
    .from('product')
    .select('*')
    .eq('category', productType);
  return data;
}
