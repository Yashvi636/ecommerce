import {
  configureStore,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCurrentUser } from './utils/auth';

// Product type
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Products API
export const productsApi = createApi({
  reducerPath: 'productsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://fakestoreapi.com/',
  }),

  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => 'products',
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `products/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;

// Cart item type
export interface CartItem extends Product {
  quantity: number;
}

const CART_STORAGE_PREFIX = 'shopzone_cart_';

// Read the current user's cart
function loadCart(): CartItem[] {
  try {
    const user = getCurrentUser();

    if (!user) return [];

    const savedCart = localStorage.getItem(`${CART_STORAGE_PREFIX}${user.id}`);

    if (!savedCart) return [];

    const parsed: unknown = JSON.parse(savedCart);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartItem =>
        typeof item?.id === 'number' &&
        typeof item?.title === 'string' &&
        typeof item?.price === 'number' &&
        typeof item?.quantity === 'number' &&
        item.quantity >= 1,
    );
  } catch (error) {
    console.error('Could not load shopping cart:', error);
    return [];
  }
}

// Save the current user's cart
function saveCart(cart: CartItem[]): void {
  try {
    const user = getCurrentUser();

    if (!user) return;

    localStorage.setItem(
      `${CART_STORAGE_PREFIX}${user.id}`,
      JSON.stringify(cart),
    );
  } catch (error) {
    console.error('Could not save shopping cart:', error);
  }
}

// Cart functionality
const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart(),

  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.find((item) => item.id === action.payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.push({
          ...action.payload,
          quantity: 1,
        });
      }

      saveCart(state);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      const updatedCart = state.filter((item) => item.id !== action.payload);

      saveCart(updatedCart);

      return updatedCart;
    },

    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.find((item) => item.id === action.payload);

      if (item) {
        item.quantity += 1;
        saveCart(state);
      }
    },

    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.find((item) => item.id === action.payload);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart(state);
      }
    },

    clearCart: () => {
      saveCart([]);
      return [];
    },

    loadUserCart: () => {
      return loadCart();
    },
  },
});

// Export cart actions
export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  loadUserCart,
} = cartSlice.actions;

// Redux store
export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    cart: cartSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
