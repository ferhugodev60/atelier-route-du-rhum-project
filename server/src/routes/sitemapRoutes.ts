import { Router } from 'express';
import { getSitemapIndex, getSitemapStatic, getSitemapProducts, getSitemapWorkshops } from '../controllers/sitemapController';

const router = Router();

router.get('/index.xml', getSitemapIndex);
router.get('/static.xml', getSitemapStatic);
router.get('/products.xml', getSitemapProducts);
router.get('/workshops.xml', getSitemapWorkshops);

export default router;
