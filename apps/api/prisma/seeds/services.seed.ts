import { PrismaClient } from "@prisma/client";

export async function seedServices(prisma: PrismaClient) {
  console.log("  ↳ Seeding service categories, packages & category-linked add-ons...");

  // 1. Categories
  const websiteCategory = await prisma.serviceCategory.upsert({
    where: { name: "Website" },
    update: { hasAddons: true },
    create: {
      name: "Website",
      description: "Static, dynamic & custom web application development",
      hasAddons: true,
      sortOrder: 1,
    },
  });

  const seoCategory = await prisma.serviceCategory.upsert({
    where: { name: "SEO" },
    update: { hasAddons: true },
    create: {
      name: "SEO",
      description: "Search engine optimization and content ranking",
      hasAddons: true,
      sortOrder: 2,
    },
  });

  const socialMediaCategory = await prisma.serviceCategory.upsert({
    where: { name: "Social Media" },
    update: { hasAddons: true },
    create: {
      name: "Social Media",
      description: "Social media management, branding & community growth",
      hasAddons: true,
      sortOrder: 3,
    },
  });

  const ecommerceCategory = await prisma.serviceCategory.upsert({
    where: { name: "E-commerce & Mini Website" },
    update: { hasAddons: true },
    create: {
      name: "E-commerce & Mini Website",
      description: "Online storefronts, payment gateways & mini catalogs",
      hasAddons: true,
      sortOrder: 4,
    },
  });

  const digitalMarketingCategory = await prisma.serviceCategory.upsert({
    where: { name: "Digital Marketing" },
    update: { hasAddons: false },
    create: {
      name: "Digital Marketing",
      description: "PPC, search ads, lead generation campaigns",
      hasAddons: false,
      sortOrder: 5,
    },
  });

  const videoCategory = await prisma.serviceCategory.upsert({
    where: { name: "Video Production" },
    update: { hasAddons: false },
    create: {
      name: "Video Production",
      description: "Corporate videos, animations & reels",
      hasAddons: false,
      sortOrder: 6,
    },
  });

  // 2. Packages under Website Category
  const staticWebsitePkg = await prisma.package.upsert({
    where: { id: "pkg-website-static" },
    update: {},
    create: {
      id: "pkg-website-static",
      categoryId: websiteCategory.id,
      name: "Static Website",
      description: "Basic static website for small business",
      price: 2999,
      duration: "1 Month",
      billingType: "ONE_TIME",
      status: true,
      sortOrder: 1,
      features: {
        create: [
          { featureName: "Responsive Mobile UI", included: true, sortOrder: 1 },
          { featureName: "5 Standard Pages", included: true, sortOrder: 2 },
          { featureName: "Contact Form", included: true, sortOrder: 3 },
          { featureName: "WhatsApp Widget", included: true, sortOrder: 4 },
          { featureName: "Basic Meta Tags", included: true, sortOrder: 5 },
        ],
      },
    },
  });

  const dynamicWebsitePkg = await prisma.package.upsert({
    where: { id: "pkg-website-dynamic" },
    update: {},
    create: {
      id: "pkg-website-dynamic",
      categoryId: websiteCategory.id,
      name: "Dynamic / E-commerce",
      description: "Business website with CMS & e-commerce",
      price: 6999,
      duration: "3 Months",
      billingType: "ONE_TIME",
      isPopular: true,
      status: true,
      sortOrder: 2,
      features: {
        create: [
          { featureName: "Admin Dashboard CMS", included: true, sortOrder: 1 },
          { featureName: "Product Catalog (Up to 50 items)", included: true, sortOrder: 2 },
          { featureName: "Stripe & Tap Payment Gateway", included: true, sortOrder: 3 },
          { featureName: "Order Tracking System", included: true, sortOrder: 4 },
          { featureName: "Multilingual Support (AR/EN)", included: true, sortOrder: 5 },
        ],
      },
    },
  });

  const premiumWebsitePkg = await prisma.package.upsert({
    where: { id: "pkg-website-premium" },
    update: {},
    create: {
      id: "pkg-website-premium",
      categoryId: websiteCategory.id,
      name: "Premium Customized",
      description: "Fully customized premium website",
      price: 12999,
      duration: "6 Months",
      billingType: "ONE_TIME",
      status: true,
      sortOrder: 3,
    },
  });

  // Packages under SEO Category
  await prisma.package.upsert({
    where: { id: "pkg-seo-basic" },
    update: {},
    create: {
      id: "pkg-seo-basic",
      categoryId: seoCategory.id,
      name: "Basic SEO Package",
      description: "On-page SEO for website",
      price: 1999,
      duration: "1 Month",
      billingType: "MONTHLY",
      status: true,
      sortOrder: 1,
    },
  });

  await prisma.package.upsert({
    where: { id: "pkg-seo-advanced" },
    update: {},
    create: {
      id: "pkg-seo-advanced",
      categoryId: seoCategory.id,
      name: "Advanced SEO Package",
      description: "Complete SEO service for website",
      price: 4999,
      duration: "3 Months",
      billingType: "MONTHLY",
      status: true,
      sortOrder: 2,
    },
  });

  // Packages under Social Media Category
  await prisma.package.upsert({
    where: { id: "pkg-social-basic" },
    update: {},
    create: {
      id: "pkg-social-basic",
      categoryId: socialMediaCategory.id,
      name: "Social Media Basic",
      description: "Manage 2 platforms",
      price: 1499,
      duration: "1 Month",
      billingType: "MONTHLY",
      status: false,
      sortOrder: 1,
    },
  });

  await prisma.package.upsert({
    where: { id: "pkg-social-premium" },
    update: {},
    create: {
      id: "pkg-social-premium",
      categoryId: socialMediaCategory.id,
      name: "Social Media Premium",
      description: "Manage all major platforms",
      price: 3999,
      duration: "3 Months",
      billingType: "MONTHLY",
      status: true,
      sortOrder: 2,
    },
  });

  // 3. Category-Specific Addons
  // Website Add-ons
  await prisma.addon.upsert({
    where: { id: "addon-web-page" },
    update: { categoryId: websiteCategory.id },
    create: {
      id: "addon-web-page",
      categoryId: websiteCategory.id,
      name: "Additional Page",
      description: "Add extra page to your website",
      price: 499,
      taxPercentage: 5.0,
      pricingType: "ONE_TIME",
      status: true,
    },
  });

  await prisma.addon.upsert({
    where: { id: "addon-web-ecom" },
    update: { categoryId: websiteCategory.id },
    create: {
      id: "addon-web-ecom",
      categoryId: websiteCategory.id,
      name: "E-commerce Integration",
      description: "Add e-commerce functionality",
      price: 2499,
      taxPercentage: 5.0,
      pricingType: "ONE_TIME",
      status: true,
    },
  });

  await prisma.addon.upsert({
    where: { id: "addon-web-ssl" },
    update: { categoryId: websiteCategory.id },
    create: {
      id: "addon-web-ssl",
      categoryId: websiteCategory.id,
      name: "SSL Certificate",
      description: "1 Year SSL certificate",
      price: 299,
      taxPercentage: 5.0,
      pricingType: "YEARLY",
      status: true,
    },
  });

  // SEO Add-ons
  await prisma.addon.upsert({
    where: { id: "addon-seo-content" },
    update: { categoryId: seoCategory.id },
    create: {
      id: "addon-seo-content",
      categoryId: seoCategory.id,
      name: "Content Writing",
      description: "SEO friendly content writing",
      price: 499,
      taxPercentage: 5.0,
      pricingType: "ONE_TIME",
      status: true,
    },
  });

  // Social Media Add-ons
  await prisma.addon.upsert({
    where: { id: "addon-social-logo" },
    update: { categoryId: socialMediaCategory.id },
    create: {
      id: "addon-social-logo",
      categoryId: socialMediaCategory.id,
      name: "Logo Design",
      description: "Professional logo design",
      price: 799,
      taxPercentage: 5.0,
      pricingType: "ONE_TIME",
      status: true,
    },
  });

  await prisma.addon.upsert({
    where: { id: "addon-social-posts" },
    update: { categoryId: socialMediaCategory.id },
    create: {
      id: "addon-social-posts",
      categoryId: socialMediaCategory.id,
      name: "Social Media Post / Month",
      description: "Creative posts for social media",
      price: 299,
      taxPercentage: 5.0,
      pricingType: "MONTHLY",
      status: true,
    },
  });

  return { category: websiteCategory, professionalPackage: staticWebsitePkg };
}
