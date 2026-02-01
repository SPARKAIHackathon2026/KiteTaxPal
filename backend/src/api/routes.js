import express from "express";
import { settleTaxHandler } from "./tax.controller.js";
import { bindWallet } from "./wallet.controller.js";
import { getTransactionsHandler } from "./transaction.controller.js";
import { getTaxProfileHandler, saveTaxProfileHandler } from "./taxProfile.controller.js";
import { analyzeTaxHandler } from "./taxAnalysis.controller.js";
import { compareStrategiesHandler } from "./taxStrategy.controller.js";

const router = express.Router();

// Wallet routes
router.post("/wallet/bind", bindWallet);

// Transaction routes
router.get("/transactions/:userAddress", getTransactionsHandler);

// Tax profile routes
router.get("/tax/profile/:userAddress", getTaxProfileHandler);
router.post("/tax/profile", saveTaxProfileHandler);

// Tax analysis routes
router.post("/tax/analyze", analyzeTaxHandler);
router.post("/tax/compare-strategies", compareStrategiesHandler);

// Tax settlement routes
router.post("/tax/settle", settleTaxHandler);

export default router;
