import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createAOrder,
  getAllOrders,
  getUserOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.use(authMiddleware);

router
  .route("/")
  .get((req, res, next) => {
    console.log(req.user);
    next();
  }, getAllOrders)
  .post(createAOrder);
router.route("/user").get(getUserOrder);
router.route("/:orderId").get(getOrderById).patch(cancelOrder);
router.route("/status/:orderId").patch(updateOrderStatus);

export default router;
