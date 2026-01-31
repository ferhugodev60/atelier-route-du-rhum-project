import { Router } from "express";
import authRoutes from "./authRoutes";
import orderRoutes from "./orderRoutes";
import shopRoutes from "./shopRoutes";
import adminRoutes from "./adminRoutes";
import userRoutes from "./userRoutes";

const router = Router();

// Préfixes des routes de l'Atelier
router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/shop", shopRoutes);
router.use("/admin", adminRoutes);
router.use('/users', userRoutes);

export default router;