import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import publicRoutes from "./routes/publicRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { connectDb } from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { errorHandler, AppError } from "./middleware/errorHandler.js";

const app = express();
app.set("trust proxy", 1);
configureCloudinary();

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, _res, next) => {
  next(new AppError("Not found", 404));
});

app.use(errorHandler);

const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;

async function main(): Promise<void> {
  if (!mongoUri) {
    console.error("MONGODB_URI is required");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is required");
    process.exit(1);
  }
  await connectDb(mongoUri);
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
