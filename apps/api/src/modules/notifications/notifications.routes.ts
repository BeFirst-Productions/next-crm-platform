import { Router } from "express";
import * as controller from "@/modules/notifications/notifications.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { validate } from "@/common/middleware/validate";
import { z } from "zod";

const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const router = Router();
router.use(authenticate);

router.get("/", controller.list);
router.patch("/:id/read", validate(idParamSchema), controller.markRead);
router.patch("/read-all", controller.markAllRead);
router.delete("/:id", validate(idParamSchema), controller.remove);

export default router;
