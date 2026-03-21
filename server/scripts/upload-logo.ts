/**
 * Script one-shot : upload du logo sur Cloudinary et affichage de l'URL à coller dans le .env
 * Usage : npx ts-node scripts/upload-logo.ts
 */
import * as dotenv from 'dotenv';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({ path: path.join(process.cwd(), '.env') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadLogo() {
    const logoPath = path.join(process.cwd(), 'public', 'assets', 'logo.jpg');

    console.log('📤 Upload du logo sur Cloudinary...');

    const result = await cloudinary.uploader.upload(logoPath, {
        public_id: 'atelier-rhum/logo-email',
        overwrite: true,
        // Transformation : redimensionné à 120px de large, format WebP, qualité auto
        transformation: [
            { width: 120, crop: 'scale' },
            { fetch_format: 'auto', quality: 'auto' }
        ]
    });

    const optimizedUrl = cloudinary.url('atelier-rhum/logo-email', {
        width: 120,
        crop: 'scale',
        fetch_format: 'auto',
        quality: 'auto',
        secure: true,
    });

    console.log('\n✅ Upload réussi !');
    console.log('URL brute :', result.secure_url);
    console.log('URL optimisée :', optimizedUrl);
    console.log('\n👉 Ajoutez cette ligne dans votre server/.env :');
    console.log(`EMAIL_LOGO_URL="${optimizedUrl}"`);
}

uploadLogo().catch(console.error);
