import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  generateCertificate,
  getUserCertificates,
  getCertificate,
  verifyCertificate,
  revokeCertificate,
  downloadCertificate,
} from "../controllers/certificate.controller.js";

const router = express.Router();

router.post("/generate", protect, generateCertificate);
router.get("/users/:userId/certificates", protect, getUserCertificates);
router.get("/:identifier", getCertificate);
router.get("/verify/:verificationCode", verifyCertificate);
router.patch("/:id/revoke", protect, authorize("admin"), revokeCertificate);
router.get("/:id/download", protect, downloadCertificate);

export default router;
