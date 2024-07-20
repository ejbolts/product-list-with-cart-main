import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  isActive: boolean;
  image: {
    thumbnail: string;
    mobile: string;
    table: string;
    desktop: string;
  };
}

export interface CartState {
  items: CartItem[];
  totalCost: number;
  totalItems: number;
  isOpen: boolean;
  queryItems: CartItem[];
  filteredItems: CartItem[];
  nameFilter: string;
  categoryFilter: string;
}

const initialState: CartState = {
  items: [],
  totalCost: 0,
  totalItems: 0,
  isOpen: false,
  queryItems: [],
  filteredItems: [],
  nameFilter: "",
  categoryFilter: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        state.totalCost += action.payload.price;
        state.totalItems++;
      } else {
        state.items.push({ ...action.payload, isActive: true });
        state.totalCost += action.payload.price;
        state.totalItems++;
      }
    },
    removeItemFromCart(state, action: PayloadAction<number>) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload
      );
      if (existingItem && existingItem.quantity > 1) {
        existingItem!.quantity--;
        state.totalCost -= existingItem.price;
        state.totalItems--;
      } else if (existingItem) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        existingItem.isActive = false;
        state.totalCost -= existingItem.price;
        state.totalItems--;
      }
    },
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.queryItems = action.payload;
      state.filteredItems = action.payload;
    },
    searchItemName(state, action: PayloadAction<string>) {
      state.nameFilter = action.payload;
      state.filteredItems = state.queryItems.filter((item) =>
        item.name.toLowerCase().includes(state.nameFilter.toLowerCase())
      );
    },
    searchItemCategory(state, action: PayloadAction<string>) {
      console.log(action.payload);
      state.categoryFilter = action.payload;
      state.filteredItems = state.queryItems.filter((item) =>
        item.category.toLowerCase().includes(state.categoryFilter.toLowerCase())
      );
    },
    clearCart(state) {
      state.items = [];
      state.totalCost = 0;
      state.totalItems = 0;
    },
    openModal(state) {
      state.isOpen = true;
    },
    closeModal(state) {
      state.isOpen = false;
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  openModal,
  closeModal,
  setItems,
  searchItemName,
  searchItemCategory,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;