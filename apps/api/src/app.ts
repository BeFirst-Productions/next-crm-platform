import express, { Express } from "express";
import path from "path";
import "express-async-errors"; // patches Express so thrown errors in async handlers reach errorHandler
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

import { env } from "@/config/env";
import { requestLogger } from "@/common/middleware/requestLogger";
import { globalRateLimiter } from "@/common/middleware/rateLimiter";
import { errorHandler } from "@/common/middleware/errorHandler";
import { notFoundHandler } from "@/common/middleware/notFoundHandler";
import apiRoutes from "@/routes";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1); // needed for correct req.ip / rate limiting behind a reverse proxy

  // ---- Global middleware ----
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(requestLogger);

  // ---- Static uploads fallback (for uploaded templates & assets) ----
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // ---- Health check (excluded from auth/rate limit/logging noise) ----
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  // ---- Normalize incoming URLs (strip accidental trailing whitespace, newlines, %0A) ----
  app.use((req, _res, next) => {
    req.url = req.url.trim().replace(/(%0A|%0D|\r|\n|\s)+$/gi, "");
    next();
  });

  // ---- API ----
  app.use(env.API_PREFIX, globalRateLimiter, apiRoutes);

  // ---- 404 + centralized error handling (always last) ----
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
