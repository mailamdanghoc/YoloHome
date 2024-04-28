import express from "express";
const router = express.Router();

import accountController from "../controllers/account.controller";
import AuthService from "../services/auth.service";

const authService = AuthService.getInstance();

// All users
router.post("/signin", accountController.signin.bind(accountController)); // Sign in
router
  .use("/:accountId", authService.authenticateMiddleware.bind(authService)) // Authentication
  .get("/:accountId", accountController.findOne.bind(accountController)) // Get info
  .patch("/:accountId", accountController.updateOne.bind(accountController)) // Edit info
  .patch(
    "/:accountId/password",
    accountController.changePassword.bind(accountController)
  ); // Change password

// ADMIN
router
  .use(
    authService.authenticateMiddleware.bind(authService),
    authService.authorizeMiddleware
  ) // Authentication and authorization
  .get("/", accountController.findAll.bind(accountController)) // Get all accounts
  .post("/", accountController.create.bind(accountController)) // Create account
  .delete("/:accountId", accountController.deleteOne.bind(accountController)) // Delete account
  .patch(
    "/:accountId/status",
    accountController.changeStatus.bind(accountController)
  ); // Activate/Deactivate account

export default router;
