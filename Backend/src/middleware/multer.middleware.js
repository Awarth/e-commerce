import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/temp");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
    const suffix = file.originalname.split(".").pop();
    cb(null, `${uniqueSuffix}.${suffix}`);
  },
});

export const upload = multer({
  storage,
});
