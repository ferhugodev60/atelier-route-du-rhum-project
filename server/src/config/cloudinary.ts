import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// 🏺 Configuration v2 avec les variables d'environnement
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'atelier-rhum/products',
            allowed_formats: ['jpg', 'png', 'webp'],
            public_id: `prod-${Date.now()}`,
        };
    },
});

export const upload = multer({ storage: storage });
export default cloudinary;