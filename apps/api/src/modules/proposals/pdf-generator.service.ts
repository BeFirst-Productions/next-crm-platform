import { getProposalById } from "@/modules/proposals/proposals.service";
import { compileProposalHtml, ProposalTemplateData } from "@/modules/proposals/template-processor.service";
import { prisma } from "@/lib/prisma";

/**
 * Renders HTML for a specific proposal by ID by gathering proposal items, client/lead details,
 * package features, addons, and category template settings.
 */
export async function renderProposalHtml(proposalId: string, actorId: string, actorRole: any): Promise<string> {
  const proposal = await getProposalById(proposalId, actorId, actorRole);

  // Extract package item and category
  const packageItem = proposal.items.find((i) => i.itemType === "PACKAGE");
  let categoryName = "Custom Services";
  let templateHtml = "";
  let bgImageUrl = "";

  if (packageItem?.packageId) {
    const pkg = await prisma.package.findUnique({
      where: { id: packageItem.packageId },
      include: { category: true, features: true },
    });
    if (pkg) {
      categoryName = pkg.category.name;
      templateHtml = pkg.category.templateHtml || "";
      if (pkg.category.bgImageUrls && pkg.category.bgImageUrls.length > 0) {
        bgImageUrl = pkg.category.bgImageUrls[0];
      }
    }
  }

  // Get package features if available
  let packageFeatures: Array<{ featureName: string; featureValue?: string | null; included: boolean }> = [];
  if (packageItem?.packageId) {
    const features = await prisma.packageFeature.findMany({
      where: { packageId: packageItem.packageId },
      orderBy: { sortOrder: "asc" },
    });
    packageFeatures = features;
  }

  // Get addon items
  const addonItems = proposal.items.filter((i) => i.itemType === "ADDON");

  // Determine client details
  const clientCompany = proposal.client?.companyName || proposal.lead?.companyName || "Valued Client";
  const clientName = proposal.client?.contacts?.[0]?.name || proposal.lead?.contactPerson || "Client Representative";
  const clientEmail = proposal.client?.contacts?.[0]?.email || proposal.lead?.email || "N/A";
  const clientPhone = proposal.client?.contacts?.[0]?.phone || proposal.lead?.phone || undefined;

  const templateData: ProposalTemplateData = {
    proposalNumber: proposal.proposalNumber,
    date: new Date(proposal.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    validUntil: proposal.expectedDeliveryDate
      ? new Date(proposal.expectedDeliveryDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : undefined,
    clientCompany,
    clientName,
    clientEmail,
    clientPhone,
    salesStaffName: proposal.salesStaff.name,
    salesStaffEmail: proposal.salesStaff.email,
    categoryName,
    packageName: packageItem?.name || "Custom Package",
    packagePrice: Number(packageItem?.unitPrice || proposal.subtotal).toFixed(2),
    packageBillingType: "ONE_TIME",
    packageFeatures,
    addons: addonItems.map((a) => ({
      name: a.name,
      quantity: a.quantity,
      unitPrice: Number(a.unitPrice).toFixed(2),
      total: Number(a.total).toFixed(2),
    })),
    subtotal: Number(proposal.subtotal).toFixed(2),
    discount: Number(proposal.discount) > 0 ? Number(proposal.discount).toFixed(2) : "0.00",
    tax: Number(proposal.tax) > 0 ? Number(proposal.tax).toFixed(2) : "0.00",
    total: Number(proposal.total).toFixed(2),
    projectDescription: proposal.projectDescription || undefined,
    notes: proposal.notes || undefined,
    bgImageUrl: bgImageUrl || undefined,
  };

  return compileProposalHtml(templateHtml, templateData);
}
