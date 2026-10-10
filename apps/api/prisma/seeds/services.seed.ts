import { PrismaClient } from "@prisma/client";

export async function seedServices(prisma: PrismaClient) {
  console.log("  ↳ Seeding service categories, packages & category-linked add-ons...");

  // 1. Categories
  const websiteCategory = await prisma.serviceCategory.upsert({
    where: { name: "Website" },
    update: { hasAddons: true, sortOrder: 1 },
    create: {
      name: "Website",
      description: "Static, dynamic & custom web application development",
      hasAddons: true,
      sortOrder: 1,
    },
  });

  const seoCategory = await prisma.serviceCategory.upsert({
    where: { name: "SEO" },
    update: {
      description: "SEO & Google growth, organic ranking and search visibility",
      hasAddons: true,
      sortOrder: 2,
    },
    create: {
      name: "SEO",
      description: "SEO & Google growth, organic ranking and search visibility",
      hasAddons: true,
      sortOrder: 2,
    },
  });

  const socialMediaCategory = await prisma.serviceCategory.upsert({
    where: { name: "Social Media" },
    update: {
      description: "Social media management, branding & community growth",
      hasAddons: true,
      sortOrder: 3,
    },
    create: {
      name: "Social Media",
      description: "Social media management, branding & community growth",
      hasAddons: true,
      sortOrder: 3,
    },
  });

  const ecommerceCategory = await prisma.serviceCategory.upsert({
    where: { name: "E-commerce & Mini Website" },
    update: {
      description: "Online storefronts, payment gateways & mini catalogs",
      hasAddons: true,
      sortOrder: 4,
    },
    create: {
      name: "E-commerce & Mini Website",
      description: "Online storefronts, payment gateways & mini catalogs",
      hasAddons: true,
      sortOrder: 4,
    },
  });

  const digitalMarketingCategory = await prisma.serviceCategory.upsert({
    where: { name: "Digital Marketing" },
    update: {
      description: "PPC, search ads, lead generation campaigns",
      hasAddons: true,
      sortOrder: 5,
    },
    create: {
      name: "Digital Marketing",
      description: "PPC, search ads, lead generation campaigns",
      hasAddons: true,
      sortOrder: 5,
    },
  });

  const videoCategory = await prisma.serviceCategory.upsert({
    where: { name: "Video Production" },
    update: {
      description: "Corporate videos, animations & reels",
      hasAddons: true,
      sortOrder: 6,
    },
    create: {
      name: "Video Production",
      description: "Corporate videos, animations & reels",
      hasAddons: true,
      sortOrder: 6,
    },
  });

  // Clean up legacy package IDs if unreferenced
  await prisma.package
    .deleteMany({
      where: {
        id: {
          in: [
            "pkg-website-static",
            "pkg-website-dynamic",
            "pkg-seo-basic",
            "pkg-seo-advanced",
            "pkg-social-basic",
            "pkg-social-premium",
          ],
        },
        proposalItems: { none: {} },
      },
    })
    .catch(() => {});

  // ==========================================================================
  // 2. Packages under Website Category
  // ==========================================================================
  const websiteFeaturesList = [
    { name: "Responsive Design", basic: true, starter: true, business: true, professional: true, premium: true },
    { name: "Basic UI Design", basic: true, starter: true, business: true, professional: true, premium: true },
    { name: "Contact Form", basic: true, starter: true, business: true, professional: true, premium: true },
    { name: "WhatsApp Integration", basic: true, starter: true, business: true, professional: true, premium: true },
    { name: "Google Maps", basic: true, starter: true, business: true, professional: true, premium: true },
    { name: "Social Media Links", basic: true, starter: true, business: true, professional: true, premium: true },
    { name: "Google Analytics", basic: false, starter: true, business: true, professional: true, premium: true },
    { name: "Admin Panel / CMS", basic: false, starter: false, business: true, professional: true, premium: true },
    { name: "Blog / News", basic: false, starter: false, business: true, professional: true, premium: true },
    { name: "Product / Service Catalogue", basic: false, starter: false, business: true, professional: true, premium: true },
    { name: "Security Setup", basic: true, starter: true, business: true, professional: true, premium: true },
    { name: "Domain name", basic: true, starter: true, business: true, professional: true, premium: true },
    { name: "Hosting/Sharing", basic: true, starter: true, business: true, professional: true, premium: true },
  ];

  const websiteTiers = [
    {
      id: "pkg-website-basic",
      name: "BASIC",
      description: "Basic website package for online presence",
      price: 799,
      duration: "1 Month",
      billingType: "ONE_TIME" as const,
      isPopular: false,
      sortOrder: 1,
      key: "basic" as const,
    },
    {
      id: "pkg-website-starter",
      name: "STARTER",
      description: "Website package for startups",
      price: 1499,
      duration: "1 Month",
      billingType: "ONE_TIME" as const,
      isPopular: false,
      sortOrder: 2,
      key: "starter" as const,
    },
    {
      id: "pkg-website-business",
      name: "BUSINESS",
      description: "Website package for small & medium businesses",
      price: 2499,
      duration: "1 Month",
      billingType: "ONE_TIME" as const,
      isPopular: true,
      sortOrder: 3,
      key: "business" as const,
    },
    {
      id: "pkg-website-professional",
      name: "PROFESSIONAL",
      description: "Website package for growing companies",
      price: 3999,
      duration: "1 Month",
      billingType: "ONE_TIME" as const,
      isPopular: false,
      sortOrder: 4,
      key: "professional" as const,
    },
    {
      id: "pkg-website-premium",
      name: "PREMIUM",
      description: "Website package for established brands",
      price: 6999,
      duration: "1 Month",
      billingType: "ONE_TIME" as const,
      isPopular: false,
      sortOrder: 5,
      key: "premium" as const,
    },
  ];

  const seededWebsitePkgs: Record<string, any> = {};

  for (const tier of websiteTiers) {
    const pkg = await prisma.package.upsert({
      where: { id: tier.id },
      update: {
        categoryId: websiteCategory.id,
        name: tier.name,
        description: tier.description,
        price: tier.price,
        duration: tier.duration,
        billingType: tier.billingType,
        isPopular: tier.isPopular,
        status: true,
        sortOrder: tier.sortOrder,
      },
      create: {
        id: tier.id,
        categoryId: websiteCategory.id,
        name: tier.name,
        description: tier.description,
        price: tier.price,
        duration: tier.duration,
        billingType: tier.billingType,
        isPopular: tier.isPopular,
        status: true,
        sortOrder: tier.sortOrder,
      },
    });

    await prisma.packageFeature.deleteMany({
      where: { packageId: pkg.id },
    });

    const featuresData = websiteFeaturesList.map((f, idx) => ({
      packageId: pkg.id,
      featureName: f.name,
      included: f[tier.key],
      sortOrder: idx + 1,
    }));

    await prisma.packageFeature.createMany({
      data: featuresData,
    });

    seededWebsitePkgs[tier.key] = pkg;
  }

  // ==========================================================================
  // 3. Standalone E-commerce Packages
  // ==========================================================================
  const ecommerceFeatures = [
    "Custom E-Commerce Design",
    "Product Catalogue",
    "Product Management",
    "Shopping Cart",
    "Checkout System",
    "Payment Gateway Integration",
    "Order Management",
    "Admin Dashboard",
    "Customer Accounts",
    "Coupon & Discount System",
    "WhatsApp Integration",
    "Google Analytics",
    "Conversion Tracking",
    "Basic SEO",
    "Mobile Optimization",
  ];

  const ecommerceTiers = [
    {
      id: "pkg-ecom-mini",
      name: "MINI E-COMMERCE WEBSITE",
      description: "Final pricing depends on functionality and product volume.",
      price: 3499,
      duration: "1 Month",
      billingType: "ONE_TIME" as const,
      isPopular: false,
      sortOrder: 1,
    },
    {
      id: "pkg-ecom-standard",
      name: "E-COMMERCE WEBSITE",
      description: "Final pricing depends on functionality and product volume.",
      price: 5999,
      duration: "1 Month",
      billingType: "ONE_TIME" as const,
      isPopular: false,
      sortOrder: 2,
    },
  ];

  for (const ecom of ecommerceTiers) {
    const pkg = await prisma.package.upsert({
      where: { id: ecom.id },
      update: {
        categoryId: ecommerceCategory.id,
        name: ecom.name,
        description: ecom.description,
        price: ecom.price,
        duration: ecom.duration,
        billingType: ecom.billingType,
        isPopular: ecom.isPopular,
        status: true,
        sortOrder: ecom.sortOrder,
      },
      create: {
        id: ecom.id,
        categoryId: ecommerceCategory.id,
        name: ecom.name,
        description: ecom.description,
        price: ecom.price,
        duration: ecom.duration,
        billingType: ecom.billingType,
        isPopular: ecom.isPopular,
        status: true,
        sortOrder: ecom.sortOrder,
      },
    });

    await prisma.packageFeature.deleteMany({
      where: { packageId: pkg.id },
    });

    await prisma.packageFeature.createMany({
      data: ecommerceFeatures.map((featName, idx) => ({
        packageId: pkg.id,
        featureName: featName,
        included: true,
        sortOrder: idx + 1,
      })),
    });
  }

  // ==========================================================================
  // 4. SEO & GOOGLE GROWTH Packages
  // ==========================================================================
  const seoPackagesData = [
    {
      id: "pkg-seo-local",
      name: "LOCAL SEO",
      description: "For businesses targeting customers in their local area.",
      price: 799,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 1,
      features: [
        "Google Business Profile Optimisation",
        "Local Keyword Research",
        "On-Page SEO",
        "Basic Technical SEO",
        "Local Citation Strategy",
        "Google Maps Optimisation",
        "Monthly Ranking Monitoring",
        "Monthly Report",
      ],
    },
    {
      id: "pkg-seo-growth",
      name: "GROWTH SEO",
      description: "Advanced SEO strategy & ranking growth.",
      price: 1499,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: true,
      sortOrder: 2,
      features: [
        "Everything in LOCAL SEO",
        "Advanced Keyword Research",
        "Technical SEO",
        "On-Page Optimisation",
        "Content Optimisation",
        "Internal Linking",
        "Competitor SEO Analysis",
        "Local SEO",
        "Google Business Profile Management",
        "Monthly SEO Strategy",
        "Ranking Monitoring",
        "Monthly SEO Report",
      ],
    },
    {
      id: "pkg-seo-authority",
      name: "AUTHORITY SEO",
      description: "High-value authority search dominance and conversion-focused SEO.",
      price: 2499,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 3,
      features: [
        "Everything in GROWTH SEO",
        "Advanced Technical SEO",
        "High-value Keyword Strategy",
        "Content Strategy",
        "Competitor Gap Analysis",
        "Backlink Strategy",
        "Advanced Local SEO",
        "Conversion-Focused SEO",
        "Schema Optimisation",
        "Monthly SEO Consultation",
        "Detailed SEO Dashboard",
      ],
    },
  ];

  for (const sPkg of seoPackagesData) {
    const pkg = await prisma.package.upsert({
      where: { id: sPkg.id },
      update: {
        categoryId: seoCategory.id,
        name: sPkg.name,
        description: sPkg.description,
        price: sPkg.price,
        duration: sPkg.duration,
        billingType: sPkg.billingType,
        isPopular: sPkg.isPopular,
        status: true,
        sortOrder: sPkg.sortOrder,
      },
      create: {
        id: sPkg.id,
        categoryId: seoCategory.id,
        name: sPkg.name,
        description: sPkg.description,
        price: sPkg.price,
        duration: sPkg.duration,
        billingType: sPkg.billingType,
        isPopular: sPkg.isPopular,
        status: true,
        sortOrder: sPkg.sortOrder,
      },
    });

    await prisma.packageFeature.deleteMany({
      where: { packageId: pkg.id },
    });

    await prisma.packageFeature.createMany({
      data: sPkg.features.map((feat, idx) => ({
        packageId: pkg.id,
        featureName: feat,
        included: true,
        sortOrder: idx + 1,
      })),
    });
  }

  // ==========================================================================
  // 5. DIGITAL MARKETING PACKAGES (From Reference PDF)
  // ==========================================================================
  const digitalMarketingPackagesData = [
    {
      id: "pkg-dm-starter",
      name: "STARTER",
      description: "For businesses building their digital presence",
      price: 1250,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 1,
      features: [
        "Social Media Management",
        "10 Static Creative Designs",
        "4 Reels / Short Videos",
        "Content Strategy",
        "Monthly Content Calendar",
        "Instagram & Facebook Management",
        "Basic Hashtag & Keyword Strategy",
        "Monthly Performance Report",
        "Basic Competitor Analysis",
      ],
    },
    {
      id: "pkg-dm-growth",
      name: "GROWTH",
      description: "For businesses that want more enquiries & customers",
      price: 1999,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: true,
      sortOrder: 2,
      features: [
        "Everything in STARTER",
        "16 Premium Creative Designs",
        "8 Reels / Short Videos",
        "Meta Ads Management",
        "Lead Generation Campaigns",
        "Audience Research & Targeting",
        "Competitor Analysis",
        "Google Business Profile Optimisation",
        "Monthly Campaign Optimisation",
        "Lead & Performance Tracking",
        "Detailed Monthly Report",
      ],
    },
    {
      id: "pkg-dm-business",
      name: "BUSINESS",
      description: "For businesses focused on consistent lead generation",
      price: 2999,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 3,
      features: [
        "Everything in GROWTH",
        "20 Premium Creative Designs",
        "12 Reels / Short Videos",
        "Meta Ads Management",
        "Google Ads Management",
        "Advanced Lead Generation",
        "Retargeting Campaigns",
        "Landing Page Strategy",
        "SEO Optimisation",
        "Conversion Optimisation",
        "Monthly Marketing Strategy",
        "Competitor & Market Analysis",
        "Priority Account Management",
      ],
    },
    {
      id: "pkg-dm-scale",
      name: "SCALE",
      description: "For established brands ready to scale",
      price: 4499,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 4,
      features: [
        "Everything in BUSINESS",
        "28 Premium Creative Designs",
        "16 Reels / Short Videos",
        "Advanced Meta Advertising",
        "Advanced Google Advertising",
        "Multiple Lead Generation Campaigns",
        "Retargeting & Remarketing",
        "Advanced SEO",
        "Landing Page Optimisation",
        "Conversion Funnel Strategy",
        "Google Business Profile Management",
        "Monthly Strategy Meeting",
        "Advanced Analytics Dashboard",
        "Dedicated Account Manager",
        "Priority Support",
      ],
    },
  ];

  for (const dmPkg of digitalMarketingPackagesData) {
    const pkg = await prisma.package.upsert({
      where: { id: dmPkg.id },
      update: {
        categoryId: digitalMarketingCategory.id,
        name: dmPkg.name,
        description: dmPkg.description,
        price: dmPkg.price,
        duration: dmPkg.duration,
        billingType: dmPkg.billingType,
        isPopular: dmPkg.isPopular,
        status: true,
        sortOrder: dmPkg.sortOrder,
      },
      create: {
        id: dmPkg.id,
        categoryId: digitalMarketingCategory.id,
        name: dmPkg.name,
        description: dmPkg.description,
        price: dmPkg.price,
        duration: dmPkg.duration,
        billingType: dmPkg.billingType,
        isPopular: dmPkg.isPopular,
        status: true,
        sortOrder: dmPkg.sortOrder,
      },
    });

    await prisma.packageFeature.deleteMany({
      where: { packageId: pkg.id },
    });

    await prisma.packageFeature.createMany({
      data: dmPkg.features.map((feat, idx) => ({
        packageId: pkg.id,
        featureName: feat,
        included: true,
        sortOrder: idx + 1,
      })),
    });
  }

  // ==========================================================================
  // 6. BRANDING, CONTENT, LEAD GENERATION & GROWTH 360 (Social Media Category)
  // ==========================================================================
  const brandingAndSocialPackagesData = [
    // 04 — BRANDING & CREATIVE
    {
      id: "pkg-brand-starter",
      name: "BRAND STARTER",
      description: "Build a professional foundation for your brand.",
      price: 999,
      duration: "One-Time",
      billingType: "ONE_TIME" as const,
      isPopular: false,
      sortOrder: 1,
      features: [
        "Logo Design",
        "2 Logo Concepts",
        "Colour Palette",
        "Typography Selection",
        "Business Card Design",
        "Social Media Profile Setup",
        "Basic Brand Guide",
      ],
    },
    {
      id: "pkg-brand-identity",
      name: "BUSINESS IDENTITY",
      description: "Create a consistent and professional brand identity.",
      price: 1999,
      duration: "One-Time",
      billingType: "ONE_TIME" as const,
      isPopular: true,
      sortOrder: 2,
      features: [
        "Everything in BRAND STARTER",
        "4 Logo Concepts",
        "Logo Variations",
        "Complete Colour System",
        "Typography System",
        "Business Card",
        "Letterhead",
        "Email Signature",
        "Social Media Templates",
        "Brand Guidelines",
        "Brand Presentation",
      ],
    },
    {
      id: "pkg-brand-complete",
      name: "COMPLETE BRAND",
      description: "A complete visual identity designed for serious businesses.",
      price: 3499,
      duration: "One-Time",
      billingType: "ONE_TIME" as const,
      isPopular: false,
      sortOrder: 3,
      features: [
        "Everything in BUSINESS IDENTITY",
        "Advanced Logo System",
        "Brand Guidelines",
        "Stationery Package",
        "Social Media Brand Kit",
        "Marketing Templates",
        "Presentation Template",
        "Corporate Profile Design",
        "Advertisement Templates",
        "Brand Application Examples",
        "Complete Brand Assets Package",
      ],
    },

    // 05 — CONTENT PRODUCTION
    {
      id: "pkg-content-starter",
      name: "CONTENT STARTER",
      description: "Starter content shooting and editing for social channels.",
      price: 799,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 4,
      features: [
        "1 Content Shoot",
        "4 Reels",
        "10 Edited Photos",
        "Basic Video Editing",
        "Social Media Formats",
        "Basic Creative Direction",
      ],
    },
    {
      id: "pkg-content-growth",
      name: "CONTENT GROWTH",
      description: "Consistent multi-shoot social content creation.",
      price: 1499,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: true,
      sortOrder: 5,
      features: [
        "2 Content Shoots",
        "8 Reels",
        "20 Edited Photos",
        "Creative Direction",
        "Script / Concept Planning",
        "Professional Editing",
        "Motion Graphics",
        "Social Media Formats",
        "Content Calendar",
      ],
    },
    {
      id: "pkg-content-pro",
      name: "CONTENT PRO",
      description: "High-frequency content production and brand video reels.",
      price: 2499,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 6,
      features: [
        "4 Content Shoots",
        "12 Reels",
        "40 Edited Photos",
        "Advanced Video Production",
        "Creative Direction",
        "Script Development",
        "Motion Graphics",
        "Product / Brand Videos",
        "Professional Editing",
        "Content Strategy",
        "Multiple Social Formats",
      ],
    },

    // 06 — LEAD GENERATION
    {
      id: "pkg-lead-starter",
      name: "LEAD STARTER",
      description: "For businesses that want a predictable source of enquiries.",
      price: 1499,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 7,
      features: [
        "Meta Ads Management",
        "1 Lead Generation Campaign",
        "Audience Targeting",
        "Ad Creative Strategy",
        "Lead Form Setup",
        "WhatsApp Integration",
        "Basic Conversion Tracking",
        "Monthly Optimisation",
        "Lead Report",
      ],
    },
    {
      id: "pkg-lead-growth",
      name: "LEAD GROWTH",
      description: "Multi-channel lead generation across Meta & Google Ads.",
      price: 2499,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: true,
      sortOrder: 8,
      features: [
        "Everything in LEAD STARTER",
        "Meta Ads",
        "Google Ads",
        "Multiple Campaigns",
        "Retargeting",
        "Landing Page Strategy",
        "Lead Form Optimisation",
        "WhatsApp Lead Flow",
        "Conversion Tracking",
        "A/B Testing",
        "Campaign Optimisation",
        "Detailed Lead Report",
      ],
    },
    {
      id: "pkg-lead-scale",
      name: "LEAD SCALE",
      description: "Full-funnel scale campaigns with conversion rate optimization.",
      price: 3999,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 9,
      features: [
        "Everything in LEAD GROWTH",
        "Advanced Meta Campaigns",
        "Advanced Google Campaigns",
        "Multiple Funnels",
        "Retargeting & Remarketing",
        "Landing Page Optimisation",
        "Conversion Rate Optimisation",
        "Advanced Audience Segmentation",
        "Lead Quality Tracking",
        "Campaign A/B Testing",
        "Advanced Analytics",
        "Weekly Optimisation",
        "Strategy Consultation",
      ],
    },

    // 07 — COMPLETE BUSINESS GROWTH
    {
      id: "pkg-growth-360",
      name: "GROWTH 360",
      description: "Your complete digital marketing partner.",
      price: 4999,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: true,
      sortOrder: 10,
      features: [
        "Digital Marketing",
        "Social Media Management",
        "16 Premium Creatives",
        "12 Reels",
        "Meta Ads Management",
        "Google Ads Management",
        "Lead Generation",
        "SEO Management",
        "Google Business Profile",
        "Content Strategy",
        "Competitor Analysis",
        "Monthly Marketing Strategy",
        "Conversion Strategy",
        "Monthly Performance Report",
        "Dedicated Account Manager",
        "Monthly Strategy Meeting",
      ],
    },
  ];

  for (const bPkg of brandingAndSocialPackagesData) {
    const pkg = await prisma.package.upsert({
      where: { id: bPkg.id },
      update: {
        categoryId: socialMediaCategory.id,
        name: bPkg.name,
        description: bPkg.description,
        price: bPkg.price,
        duration: bPkg.duration,
        billingType: bPkg.billingType,
        isPopular: bPkg.isPopular,
        status: true,
        sortOrder: bPkg.sortOrder,
      },
      create: {
        id: bPkg.id,
        categoryId: socialMediaCategory.id,
        name: bPkg.name,
        description: bPkg.description,
        price: bPkg.price,
        duration: bPkg.duration,
        billingType: bPkg.billingType,
        isPopular: bPkg.isPopular,
        status: true,
        sortOrder: bPkg.sortOrder,
      },
    });

    await prisma.packageFeature.deleteMany({
      where: { packageId: pkg.id },
    });

    await prisma.packageFeature.createMany({
      data: bPkg.features.map((feat, idx) => ({
        packageId: pkg.id,
        featureName: feat,
        included: true,
        sortOrder: idx + 1,
      })),
    });
  }

  // ==========================================================================
  // 7. VIDEO PRODUCTION PACKAGES
  // ==========================================================================
  const videoPackagesData = [
    {
      id: "pkg-video-starter",
      name: "REELS & SHORTS STARTER",
      description: "High-impact short form content for TikTok & Instagram Reels",
      price: 999,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 1,
      features: [
        "1 On-location Shoot Day",
        "6 Edited Reels / TikTok Videos",
        "Concept & Script Ideation",
        "Sound Design & Viral Audio",
        "Dynamic Captions & Subtitles",
        "1080p / 4K UHD Output",
        "1 Round of Revisions per Reel",
      ],
    },
    {
      id: "pkg-video-growth",
      name: "COMMERCIAL & BRAND GROWTH",
      description: "Cinematic commercial videos designed for high brand authority",
      price: 2499,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: true,
      sortOrder: 2,
      features: [
        "2 On-location Shoot Days",
        "12 Edited Reels / Short Videos",
        "1 High-End Brand Promo (60s)",
        "Professional Lighting & Audio Rig",
        "Creative Director & Scriptwriter",
        "Drone Aerial Footage Included",
        "Color Grading & Sound Mastering",
        "Thumbnail & Cover Designs",
      ],
    },
    {
      id: "pkg-video-pro",
      name: "CINEMATIC ENTERPRISE SUITE",
      description: "Full-scale corporate production for enterprise campaigns & ads",
      price: 4999,
      duration: "1 Month",
      billingType: "MONTHLY" as const,
      isPopular: false,
      sortOrder: 3,
      features: [
        "Full Production Crew & Dedicated DP",
        "20 Edited Reels / Short Videos",
        "2 Full Brand Films / TV Commercials",
        "Voiceover Recording & Licensing",
        "Cinema Camera 6K RAW Capture",
        "2D Motion Graphics & Animation",
        "Dedicated Video Editor & Colorist",
        "Multi-platform Formats (16:9, 9:16, 1:1)",
      ],
    },
  ];

  for (const vPkg of videoPackagesData) {
    const pkg = await prisma.package.upsert({
      where: { id: vPkg.id },
      update: {
        categoryId: videoCategory.id,
        name: vPkg.name,
        description: vPkg.description,
        price: vPkg.price,
        duration: vPkg.duration,
        billingType: vPkg.billingType,
        isPopular: vPkg.isPopular,
        status: true,
        sortOrder: vPkg.sortOrder,
      },
      create: {
        id: vPkg.id,
        categoryId: videoCategory.id,
        name: vPkg.name,
        description: vPkg.description,
        price: vPkg.price,
        duration: vPkg.duration,
        billingType: vPkg.billingType,
        isPopular: vPkg.isPopular,
        status: true,
        sortOrder: vPkg.sortOrder,
      },
    });

    await prisma.packageFeature.deleteMany({
      where: { packageId: pkg.id },
    });

    await prisma.packageFeature.createMany({
      data: vPkg.features.map((feat, idx) => ({
        packageId: pkg.id,
        featureName: feat,
        included: true,
        sortOrder: idx + 1,
      })),
    });
  }

  // ==========================================================================
  // 8. ADD-ON SERVICES (Category-Linked Add-ons)
  // ==========================================================================
  const allAddonsData = [
    // Creative & Content (Video / Social)
    {
      id: "addon-additional-creative",
      categoryId: socialMediaCategory.id,
      name: "Additional Creative",
      description: "Custom social or display creative asset",
      price: 75,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-additional-reel",
      categoryId: videoCategory.id,
      name: "Additional Reel",
      description: "Extra short-form reel video edited and rendered",
      price: 150,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-motion-graphic",
      categoryId: videoCategory.id,
      name: "Motion Graphic",
      description: "Motion graphics animation for campaigns",
      price: 200,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-product-photography",
      categoryId: videoCategory.id,
      name: "Product Photography",
      description: "Professional product photography shoot & retouching",
      price: 499,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-professional-photoshoot",
      categoryId: videoCategory.id,
      name: "Professional Photoshoot",
      description: "Half-day on-location professional photoshoot",
      price: 499,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-professional-videoshoot",
      categoryId: videoCategory.id,
      name: "Professional Video Shoot",
      description: "On-location professional 4K videography shoot",
      price: 699,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-corporate-video",
      categoryId: videoCategory.id,
      name: "Corporate Video",
      description: "Full corporate company profile video production",
      price: 1499,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-drone-shoot",
      categoryId: videoCategory.id,
      name: "Drone Shoot",
      description: "Aerial licensed drone filming and photography",
      price: 0,
      pricingType: "CUSTOM" as const,
    },

    // Digital
    {
      id: "addon-landing-page",
      categoryId: websiteCategory.id,
      name: "Landing Page",
      description: "High-converting standalone sales landing page",
      price: 799,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-website-maintenance",
      categoryId: websiteCategory.id,
      name: "Website Maintenance",
      description: "Ongoing monthly security, updates & backup maintenance",
      price: 299,
      pricingType: "MONTHLY" as const,
    },
    {
      id: "addon-seo-service",
      categoryId: seoCategory.id,
      name: "SEO Add-On",
      description: "Monthly supplemental search engine optimization",
      price: 500,
      pricingType: "MONTHLY" as const,
    },
    {
      id: "addon-gbp-management",
      categoryId: seoCategory.id,
      name: "Google Business Profile",
      description: "Monthly Google Business Profile management & updates",
      price: 300,
      pricingType: "MONTHLY" as const,
    },
    {
      id: "addon-whatsapp-marketing",
      categoryId: digitalMarketingCategory.id,
      name: "WhatsApp Marketing",
      description: "Broadcast setup, catalog sync & lead capture",
      price: 499,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-whatsapp-automation",
      categoryId: digitalMarketingCategory.id,
      name: "WhatsApp Automation",
      description: "AI bot flows, automated booking & CRM webhook integration",
      price: 0,
      pricingType: "CUSTOM" as const,
    },
    {
      id: "addon-email-marketing",
      categoryId: digitalMarketingCategory.id,
      name: "Email Marketing",
      description: "Monthly newsletter, drip campaigns & segmentation",
      price: 499,
      pricingType: "MONTHLY" as const,
    },

    // Advertising
    {
      id: "addon-meta-ads-setup",
      categoryId: digitalMarketingCategory.id,
      name: "Meta Ads Setup",
      description: "Pixel setup, business manager config & catalogue link",
      price: 300,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-google-ads-setup",
      categoryId: digitalMarketingCategory.id,
      name: "Google Ads Setup",
      description: "Conversion tag, Google Tag Manager & search campaign setup",
      price: 400,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-additional-campaign",
      categoryId: digitalMarketingCategory.id,
      name: "Additional Campaign",
      description: "Launch and manage an additional advertising campaign",
      price: 300,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-retargeting-campaign",
      categoryId: digitalMarketingCategory.id,
      name: "Retargeting Campaign",
      description: "Custom audience remarketing across Meta & Google",
      price: 400,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-conversion-tracking-setup",
      categoryId: digitalMarketingCategory.id,
      name: "Conversion Tracking Setup",
      description: "Server-side CAPI and Google Analytics 4 event tracking",
      price: 300,
      pricingType: "ONE_TIME" as const,
    },

    // Branding
    {
      id: "addon-logo-design",
      categoryId: socialMediaCategory.id,
      name: "Logo Design",
      description: "Standalone professional logo design with vector assets",
      price: 499,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-business-card",
      categoryId: socialMediaCategory.id,
      name: "Business Card",
      description: "Custom print-ready business card design",
      price: 199,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-company-profile",
      categoryId: socialMediaCategory.id,
      name: "Company Profile",
      description: "8-12 page corporate profile design (PDF & print)",
      price: 499,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-brochure-design",
      categoryId: socialMediaCategory.id,
      name: "Brochure Design",
      description: "Tri-fold or bi-fold sales brochure design",
      price: 299,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-presentation-design",
      categoryId: socialMediaCategory.id,
      name: "Presentation Design",
      description: "Pitch deck & corporate presentation template",
      price: 499,
      pricingType: "ONE_TIME" as const,
    },
    {
      id: "addon-brand-guidelines",
      categoryId: socialMediaCategory.id,
      name: "Brand Guidelines",
      description: "Comprehensive brand identity guidelines handbook",
      price: 799,
      pricingType: "ONE_TIME" as const,
    },

    // Other
    {
      id: "addon-influencer-marketing",
      categoryId: digitalMarketingCategory.id,
      name: "Influencer Marketing",
      description: "UAE influencer outreach, campaign coordination & tracking",
      price: 0,
      pricingType: "CUSTOM" as const,
    },
    {
      id: "addon-pr-media-marketing",
      categoryId: digitalMarketingCategory.id,
      name: "PR & Media Marketing",
      description: "Press releases, news publication & digital PR distribution",
      price: 0,
      pricingType: "CUSTOM" as const,
    },
    {
      id: "addon-event-marketing",
      categoryId: digitalMarketingCategory.id,
      name: "Event Marketing",
      description: "Corporate event coverage, booth branding & live promotion",
      price: 0,
      pricingType: "CUSTOM" as const,
    },
    {
      id: "addon-corporate-marketing",
      categoryId: digitalMarketingCategory.id,
      name: "Corporate Marketing",
      description: "B2B enterprise marketing strategy & execution",
      price: 0,
      pricingType: "CUSTOM" as const,
    },
    {
      id: "addon-ecommerce-marketing",
      categoryId: digitalMarketingCategory.id,
      name: "E-Commerce Marketing",
      description: "ROAS-driven shopping campaigns, catalog & dynamic ads",
      price: 0,
      pricingType: "CUSTOM" as const,
    },
    {
      id: "addon-personal-branding",
      categoryId: socialMediaCategory.id,
      name: "Personal Branding",
      description: "Executive & founder personal branding on LinkedIn & Twitter",
      price: 0,
      pricingType: "CUSTOM" as const,
    },
  ];

  for (const addon of allAddonsData) {
    await prisma.addon.upsert({
      where: { id: addon.id },
      update: {
        categoryId: addon.categoryId,
        name: addon.name,
        description: addon.description,
        price: addon.price,
        pricingType: addon.pricingType,
        taxPercentage: 5.0,
        status: true,
      },
      create: {
        id: addon.id,
        categoryId: addon.categoryId,
        name: addon.name,
        description: addon.description,
        price: addon.price,
        pricingType: addon.pricingType,
        taxPercentage: 5.0,
        status: true,
      },
    });
  }

  return { category: websiteCategory, professionalPackage: seededWebsitePkgs.professional };
}

// Standalone execution support: allows running this seed file directly via cmd / terminal
if (process.argv[1] && process.argv[1].replace(/\\/g, "/").includes("services.seed")) {
  (async () => {
    const dotenv = await import("dotenv");
    dotenv.config();
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      console.error("❌ DATABASE_URL environment variable is not set in .env");
      process.exit(1);
    }

    const adapter = new PrismaPg({ connectionString });
    const directPrisma = new PrismaClient({ adapter });

    try {
      console.log("🌱 Running standalone Services & Packages seed...");
      await seedServices(directPrisma);
      console.log("✅ Services, packages and add-ons seeded successfully!");
    } catch (error) {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    } finally {
      await directPrisma.$disconnect();
    }
  })();
}
