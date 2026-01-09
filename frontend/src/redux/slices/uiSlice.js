import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    cartOpen: false,
    mobileMenuOpen: false,
    modalOpen: false,
  },
  reducers: {
    toggleCart: (state) => {
      state.cartOpen = !state.cartOpen;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    openModal: (state) => {
      state.modalOpen = true;
    },
    closeModal: (state) => {
      state.modalOpen = false;
    },
  },
});

export const { toggleCart, toggleMobileMenu, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;