import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  addAProduct,
  updateProductDetails,
  updateProductImage,
  removeAProduct,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(authMiddleware, upload.single("image"), addAProduct);
router
  .route("/:productId")
  .get(getProductById)
  .patch(authMiddleware, updateProductDetails)
  .delete(authMiddleware, removeAProduct);
router
  .route("/image/:productId")
  .patch(authMiddleware, upload.single("image"), updateProductImage);

export default router;
