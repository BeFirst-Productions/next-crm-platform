"use client";

import * as React from "react";
import { ProposalDeckView, ProposalDeckData } from "@/components/proposal/ProposalDeckView";
import { useProposalStore, ALL_ADDONS } from "@/stores";
import { fetchPackages, fetchAddons, fetchCategories, PackageItem, AddonItem, ServiceCategory } from "@/lib/catalog-api";
import { Loader2 } from "lucide-react";


export default function ClientPortalProposalPage() {
  const { companyDetails, packageSelection, selectedAddonIds } = useProposalStore();

  const [dbPackages, setDbPackages] = React.useState<PackageItem[]>([]);
  const [dbAddons, setDbAddons] = React.useState<AddonItem[]>([]);
  const [dbCategories, setDbCategories] = React.useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetchPackages().catch(() => []),
      fetchAddons().catch(() => []),
      fetchCategories().catch(() => []),
    ]).then(([pkgs, addons, cats]) => {
      if (isMounted) {
        if (pkgs) setDbPackages(pkgs);
        if (addons) setDbAddons(addons);
        if (cats) setDbCategories(cats);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Format delivery date
  const formattedDeliveryDate = React.useMemo(() => {
    if (!companyDetails.expectedDeliveryDate) return undefined;
    try {
      const date = new Date(companyDetails.expectedDeliveryDate);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return companyDetails.expectedDeliveryDate;
    }
  }, [companyDetails.expectedDeliveryDate]);

  // Match package from DB or fallback
  const packageInfo = React.useMemo(() => {
    const targetKey = (
      packageSelection.ecommerce ||
      packageSelection.tier ||
      "professional"
    ).toLowerCase();

    const pool = dbPackages;
    if (pool.length > 0) {
      const match =
        pool.find((p) => {
          const id = p.id.toLowerCase();
          const name = p.name.toLowerCase();
          return id === targetKey || id === `pkg-${targetKey}` || name === targetKey;
        }) ||
        pool.find((p) => {
          const id = p.id.toLowerCase();
          const name = p.name.toLowerCase();
          const parts = id.replace("pkg-", "").split("-");
          return parts.includes(targetKey) || id.endsWith(`-${targetKey}`) || name.includes(targetKey);
        }) ||
        pool.find((p) => p.id.toLowerCase().includes(targetKey));

      if (match) {
        const feats =
          match.features && match.features.length > 0
            ? match.features.filter((f) => f.included).map((f) => f.featureName)
            : ["Responsive Design", "Mobile First Optimisation", "Contact Form", "SEO Meta Tags"];

        return {
          id: match.id,
          name: match.name,
          price: Number(match.price) || 0,
          features: feats,
        };
      }
    }

    return {
      name: "LOCAL SEO",
      price: 799,
      features: [
        "Google Business Profile Optimisation",
        "Local Keyword Research",
        "On-Page SEO",
        "Basic Technical SEO",
        "Google Maps Optimisation",
      ],
    };
  }, [packageSelection, dbPackages]);

  // Selected add-ons
  const selectedAddonsList = React.useMemo(() => {
    return selectedAddonIds
      .map((id) => {
        const dbMatch = dbAddons.find((a) => a.id === id);
        if (dbMatch) {
          return {
            id: dbMatch.id,
            name: dbMatch.name,
            price: Number(dbMatch.price) || 0,
          };
        }
        const staticMatch = ALL_ADDONS.find((a) => a.id === id);
        if (staticMatch) {
          return {
            id: staticMatch.id,
            name: staticMatch.name,
            price: staticMatch.price,
          };
        }
        return null;
      })
      .filter(Boolean) as { id: string; name: string; price: number }[];
  }, [selectedAddonIds, dbAddons]);

  const packagePrice = packageInfo.price;
  const addonsTotal = selectedAddonsList.reduce((sum, item) => sum + item.price, 0);
  const subTotal = packagePrice + addonsTotal;
  const vatAmount = subTotal * 0.05;
  const grandTotal = subTotal + vatAmount;

  const proposalDeckData: ProposalDeckData = {
    clientName: companyDetails.contactPerson || "Client",
    companyName: companyDetails.companyName || "Client Company",
    email: companyDetails.emailAddress || "info@client.com",
    phone: companyDetails.contactNumber || "—",
    location: companyDetails.location || "UAE",
    industry: companyDetails.industry || "General",
    packageName: packageInfo.name,
    packagePrice: packagePrice,
    packageFeatures: packageInfo.features,
    selectedAddons: selectedAddonsList,
    subTotal,
    vatAmount,
    grandTotal,
    proposalNumber: "PROP-2026-0001",
    proposalDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    expectedDeliveryDate: formattedDeliveryDate || undefined,
    projectDescription: companyDetails.projectDescription,
    additionalNotes: companyDetails.additionalNotes,
    serviceCategory: dbCategories.find((c) => c.id === packageSelection.category)?.name || packageSelection.category || "Website Development",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030812] flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
        <span className="text-xs font-semibold text-slate-400">Loading Official Proposal Deck...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#030812]">
      <ProposalDeckView
        data={proposalDeckData}
        initialMode="document"
        onClose={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/client-portal/review";
          }
        }}
      />
    </div>
  );
}
