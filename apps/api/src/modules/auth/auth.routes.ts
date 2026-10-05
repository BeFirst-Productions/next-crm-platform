import { Router } from "express";
import * as controller from "@/modules/auth/auth.controller";
import { validate } from "@/common/middleware/validate";
import { authenticate, authenticateOptional } from "@/common/middleware/authenticate";
import { authRateLimiter } from "@/common/middleware/rateLimiter";
import { loginSchema, refreshSchema, registerSchema } from "@/modules/auth/auth.validation";

const router = Router();

// Registration: public users default to SALES_STAFF; authenticated SUPER_ADMIN can assign any role
router.post("/register", authRateLimiter, authenticateOptional, validate(registerSchema), controller.register);
router.post("/login", authRateLimiter, validate(loginSchema), controller.login);
router.post("/refresh", authRateLimiter, validate(refreshSchema), controller.refresh);
router.post("/logout", controller.logout);
router.get("/me", authenticate, controller.me);

export default router;
