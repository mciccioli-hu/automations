/**
 * Seed script for initial data.
 * Run with: npx prisma db seed
 *
 * Seeds:
 * - Default agency
 * - Default admin user
 * - All templates from the registry
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create default agency
  const agency = await prisma.agency.upsert({
    where: { slug: 'demo-inmobiliaria' },
    update: {},
    create: {
      name: 'Demo Inmobiliaria',
      slug: 'demo-inmobiliaria',
      logoUrl: '',
      primaryColor: '#1a365d',
      secondaryColor: '#e2e8f0',
      fontFamily: 'Inter',
      instagramHandle: 'demo_inmobiliaria',
      whatsapp: '541112345678',
      website: 'https://demo-inmobiliaria.com',
    },
  });
  console.log(`Agency: ${agency.name} (${agency.id})`);

  // 2. Create default user
  const user = await prisma.user.upsert({
    where: { email: 'admin@demo-inmobiliaria.com' },
    update: {},
    create: {
      email: 'admin@demo-inmobiliaria.com',
      name: 'Admin Demo',
      role: 'admin',
      agencyId: agency.id,
    },
  });
  console.log(`User: ${user.name} (${user.id})`);

  // 3. Seed templates
  // Note: In production, templates are loaded from code (registry.ts).
  // This seed is for the DB-backed template storage option.
  const templates = [
    {
      id: 'hero-overlay',
      version: '1.0.0',
      name: 'Hero con Overlay',
      description: '1 foto grande con degradado y datos superpuestos',
      category: 'hero',
      imageCount: 1,
      maxImages: null,
    },
    {
      id: 'hero-minimal',
      version: '1.0.0',
      name: 'Hero Minimal',
      description: '1 foto con panel lateral de datos — estilo premium',
      category: 'hero',
      imageCount: 1,
      maxImages: null,
    },
    {
      id: 'collage-2',
      version: '1.0.0',
      name: 'Collage 2 Fotos',
      description: '2 fotos lado a lado con datos abajo',
      category: 'collage',
      imageCount: 2,
      maxImages: null,
    },
    {
      id: 'collage-3',
      version: '1.0.0',
      name: 'Collage 3 Fotos',
      description: '1 foto grande arriba + 2 fotos chicas abajo',
      category: 'collage',
      imageCount: 3,
      maxImages: null,
    },
    {
      id: 'collage-4',
      version: '1.0.0',
      name: 'Collage 4 Fotos',
      description: 'Grid 2x2 con datos superpuestos en el centro',
      category: 'collage',
      imageCount: 4,
      maxImages: null,
    },
    {
      id: 'carousel-cover',
      version: '1.0.0',
      name: 'Carrusel con Cover',
      description: 'Cover con datos + slides de fotos individuales',
      category: 'carousel',
      imageCount: 2,
      maxImages: 10,
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { id: t.id },
      update: {
        version: t.version,
        name: t.name,
        description: t.description,
      },
      create: {
        ...t,
        definition: {}, // Full definition is loaded from code
      },
    });
    console.log(`Template: ${t.name} (${t.id})`);
  }

  console.log('Seed complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
