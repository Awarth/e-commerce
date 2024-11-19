import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  getCartDetails,
  clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.use(authMiddleware);

router.route("/").get(getCartDetails);
router.route("/add").post(addItemToCart);
router.route("/remove").delete(removeItemFromCart);
router.route("/update-quantity").patch(updateItemQuantity);
router.route("/clear").delete(clearCart);

export default router;
