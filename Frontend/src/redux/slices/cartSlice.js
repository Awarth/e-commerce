import { createSlice } from "@reduxjs/toolkit";
import {
  saveCartToLocalStorage,
  getCartFromLocalStorage,
} from "../../utility/localStorage";

const initialState = {
  items: getCartFromLocalStorage() || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity, image, stock, name, price } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        if (quantity < action.payload.stock) {
          existingItem.quantity += quantity;
        }
      } else {
        state.items.push({ productId, quantity, image, stock, name, price });
      }
      saveCartToLocalStorage(state.items);
    },
    updateCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (item) => item.productId !== productId
          );
        }
        saveCartToLocalStorage(state.items);
      }
    },
    setCart: (state, action) => {
      state.items = action.payload;
      saveCartToLocalStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      saveCartToLocalStorage(state.items);
    },
  },
});

export const { addToCart, updateCart, setCart, clearCart, removeFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;
