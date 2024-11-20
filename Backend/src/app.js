import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routers/user.routes.js";
import productRouter from "./routers/product.routes.js";
import cartRouter from "./routers/cart.routes.js";
import orderRouter from "./routers/order.routes.js";

app.get('/',(req,res)=>{
  res.send('E commerce api')
})
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

export default app;
