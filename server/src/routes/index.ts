import { Router } from "express";
import authRoutes from "./authRoutes";
import orderRoutes from "./orderRoutes";
import shopRoutes from "./shopRoutes";
import adminRoutes from "./adminRoutes";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import checkoutRoutes from "./checkoutRoutes";
import categoryRoutes from "./categoryRoutes";
import workshopRoutes from "./workshopRoutes";

const router = Router();

// Préfixes des routes de l'Atelier
router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);
router.use("/shop", shopRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/admin", adminRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use("/workshops", workshopRoutes);

export default router;