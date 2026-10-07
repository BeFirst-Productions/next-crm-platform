import { Router } from "express";
import { categories, packages, addons } from "@/modules/services/services.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { validate } from "@/common/middleware/validate";
import { PERMISSIONS } from "@/common/constants/roles";
import {
  createAddonSchema,
  createCategorySchema,
  createPackageSchema,
  idParamSchema,
  updateAddonSchema,
  updateCategorySchema,
  updatePackageSchema,
} from "@/modules/services/services.validation";

import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max PDF template upload
});

// Mounted at /service-categories, /packages, /addons (see routes/index.ts)

export const categoryRouter = Router();
categoryRouter.get("/", categories.list);
categoryRouter.post("/", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(createCategorySchema), categories.create);
categoryRouter.patch("/:id", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(updateCategorySchema), categories.update);
categoryRouter.delete("/:id", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(idParamSchema), categories.delete);
categoryRouter.post("/:id/template", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), upload.single("templatePdf"), categories.uploadTemplate);

export const packageRouter = Router();
packageRouter.get("/", packages.list);
packageRouter.get("/:id", validate(idParamSchema), packages.getById);
packageRouter.post("/", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(createPackageSchema), packages.create);
packageRouter.patch("/:id", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(updatePackageSchema), packages.update);
packageRouter.delete("/:id", authenticate, authorize(PERMISSIONS.PACKAGES_MANAGE), validate(idParamSchema), packages.delete);

export const addonRouter = Router();
addonRouter.get("/", addons.list);
addonRouter.post("/", authenticate, authorize(PERMISSIONS.ADDONS_MANAGE), validate(createAddonSchema), addons.create);
addonRouter.patch("/:id", authenticate, authorize(PERMISSIONS.ADDONS_MANAGE), validate(updateAddonSchema), addons.update);
addonRouter.delete("/:id", authenticate, authorize(PERMISSIONS.ADDONS_MANAGE), validate(idParamSchema), addons.delete);
