import { Router } from "express";
import * as controller from "@/modules/clients/clients.controller";
import { authenticate } from "@/common/middleware/authenticate";
import { authorize } from "@/common/middleware/authorize";
import { validate } from "@/common/middleware/validate";
import { PERMISSIONS } from "@/common/constants/roles";
import { createClientSchema, idParamSchema, listClientsSchema, updateClientSchema } from "@/modules/clients/clients.validation";

const router = Router();
router.use(authenticate);

router.get("/", authorize(PERMISSIONS.CLIENTS_LIST), validate(listClientsSchema), controller.list);
router.get("/:id", authorize(PERMISSIONS.CLIENTS_LIST), validate(idParamSchema), controller.getById);
router.post("/", authorize(PERMISSIONS.CLIENTS_CREATE), validate(createClientSchema), controller.create);
router.patch("/:id", authorize(PERMISSIONS.CLIENTS_EDIT), validate(updateClientSchema), controller.update);
router.delete("/:id", authorize(PERMISSIONS.CLIENTS_DELETE), validate(idParamSchema), controller.remove);

export default router;
