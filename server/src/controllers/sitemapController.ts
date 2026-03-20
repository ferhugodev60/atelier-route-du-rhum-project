import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const SITE_URL = process.env.FRONTEND_URL || 'https://atelier-route-du-rhum-project-seven.vercel.app';

const slugify = (name: string) =>
    name.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';

export const getSitemapIndex = (_req: Request, res: Response) => {
    const xml = `${xmlHeader}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/api/sitemaps/static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/api/sitemaps/products.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/api/sitemaps/workshops.xml</loc>
  </sitemap>
</sitemapindex>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
};

export const getSitemapStatic = (_req: Request, res: Response) => {
    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/boutique', priority: '0.9', changefreq: 'daily' },
        { url: '/atelier-conception', priority: '0.9', changefreq: 'weekly' },
        { url: '/ateliers/decouverte', priority: '0.8', changefreq: 'weekly' },
        { url: '/ateliers/conception/1', priority: '0.8', changefreq: 'weekly' },
        { url: '/ateliers/conception/2', priority: '0.8', changefreq: 'weekly' },
        { url: '/ateliers/conception/3', priority: '0.8', changefreq: 'weekly' },
        { url: '/ateliers/conception/4', priority: '0.8', changefreq: 'weekly' },
        { url: '/carte-cadeau', priority: '0.7', changefreq: 'monthly' },
        { url: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
        { url: '/cgv', priority: '0.3', changefreq: 'yearly' },
    ];

    const urls = staticPages.map(p => `
  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

    const xml = `${xmlHeader}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
};

export const getSitemapProducts = async (_req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({ select: { name: true, updatedAt: true } });

        const urls = products.map(p => `
  <url>
    <loc>${SITE_URL}/boutique/${slugify(p.name)}</loc>
    <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

        const xml = `${xmlHeader}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch {
        res.status(500).send('Erreur génération sitemap produits.');
    }
};

export const getSitemapWorkshops = async (_req: Request, res: Response) => {
    try {
        const workshops = await prisma.workshop.findMany({ select: { level: true } });

        const urls = workshops.map(w => {
            const urlPath = w.level === 0 ? '/ateliers/decouverte' : `/ateliers/conception/${w.level}`;
            return `
  <url>
    <loc>${SITE_URL}${urlPath}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }).join('');

        const xml = `${xmlHeader}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch {
        res.status(500).send('Erreur génération sitemap ateliers.');
    }
};
