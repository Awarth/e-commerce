const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const getCartFromLocalStorage = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  return Array.isArray(cart) ? cart : [];
};

export { saveCartToLocalStorage, getCartFromLocalStorage };
