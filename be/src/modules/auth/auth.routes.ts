import { Router, type Router as RouterType } from "express";
import { ROUTES } from "../../constants/routes.js";
import {
  authenticate,
  authenticateRefreshToken,
  validate,
} from "../../middlewares/index.js";
import * as authController from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schema.js";

const router: RouterType = Router();

router.post(
  ROUTES.AUTH.LOGIN,
  validate({ body: loginSchema }),
  authController.login
);

router.post(
  ROUTES.AUTH.REGISTER,
  validate({ body: registerSchema }),
  authController.register
);

router.post(
  ROUTES.AUTH.REFRESH,
  authenticateRefreshToken,
  authController.refresh
);

router.post(ROUTES.AUTH.LOGOUT, authenticate, authController.logout);

router.get(ROUTES.AUTH.ME, authenticate, authController.me);

export default router;
