import { prisma } from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/common/errors/AppError";
import { buildPaginationMeta, toSkipTake } from "@/common/utils/pagination";
import { recordAuditLog } from "@/modules/audit/audit.service";
import { calculateProposal, ProposalItemInput } from "@/modules/proposals/proposal-calculator";
import { ProposalStatus } from "@prisma/client";

async function generateProposalNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.proposal.count({ where: { createdAt: { gte: new Date(`${year}-01-01`) } } });
  return `PROP-${year}-${String(count + 1).padStart(4, "0")}`;
}

/** Allowed forward transitions for the proposal status machine (spec section 12). */
const ALLOWED_TRANSITIONS: Record<ProposalStatus, ProposalStatus[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["UNDER_REVIEW", "CANCELLED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["SENT_TO_CLIENT", "CANCELLED"],
  SENT_TO_CLIENT: ["CLIENT_ACCEPTED", "REJECTED", "EXPIRED"],
  CLIENT_ACCEPTED: ["CONTRACT_CREATED"],
  CONTRACT_CREATED: [],
  REJECTED: [],
  CANCELLED: [],
  EXPIRED: [],
};

import { RoleName } from "@/common/constants/roles";

export async function listProposals(params: {
  page: number; limit: number; status?: ProposalStatus; actorId: string; actorRole: RoleName;
}) {
  const { page, limit, status, actorId, actorRole } = params;
  const where = {
    ...(status ? { status } : {}),
    ...(actorRole === "SALES_STAFF" ? { salesStaffId: actorId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.proposal.findMany({
      where,
      include: { client: true, lead: true, salesStaff: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      ...toSkipTake(page, limit),
    }),
    prisma.proposal.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(total, page, limit) };
}

export async function getProposalById(id: string, actorId: string, actorRole: RoleName) {
  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: {
      items: true,
      lead: true,
      client: { include: { contacts: true } },
      salesStaff: { select: { id: true, name: true, email: true } },
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!proposal) throw new NotFoundError("Proposal");
  if (actorRole === "SALES_STAFF" && proposal.salesStaffId !== actorId) {
    throw new NotFoundError("Proposal"); // don't leak existence to other staff
  }
  return proposal;
}

export async function createProposal(
  input: {
    leadId?: string; clientId?: string; expectedDeliveryDate?: Date; projectDescription?: string;
    notes?: string; discount: number; taxRatePercent: number; items: ProposalItemInput[];
  },
  actorId: string,
) {
  const calc = await calculateProposal(input.items, input.discount, input.taxRatePercent);
  const proposalNumber = await generateProposalNumber();

  const proposal = await prisma.proposal.create({
    data: {
      proposalNumber,
      leadId: input.leadId,
      clientId: input.clientId,
      salesStaffId: actorId,
      status: "DRAFT",
      subtotal: calc.subtotal,
      discount: calc.discount,
      tax: calc.tax,
      total: calc.total,
      expectedDeliveryDate: input.expectedDeliveryDate,
      projectDescription: input.projectDescription,
      notes: input.notes,
      items: {
        create: calc.items.map((i) => ({
          itemType: i.itemType,
          packageId: i.packageId,
          addonId: i.addonId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.total,
        })),
      },
      statusHistory: { create: { toStatus: "DRAFT", changedBy: actorId } },
    },
    include: { items: true },
  });

  await recordAuditLog({ userId: actorId, action: "CREATE", module: "proposals", recordId: proposal.id, newValues: proposal });
  return proposal;
}

export async function recalculateProposalItems(
  id: string,
  items: ProposalItemInput[],
  discount: number | undefined,
  taxRatePercent: number | undefined,
  actorId: string,
) {
  const existing = await prisma.proposal.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Proposal");
  if (existing.status !== "DRAFT") {
    throw new BadRequestError("Only DRAFT proposals can have their items changed");
  }

  const calc = await calculateProposal(items, discount ?? Number(existing.discount), taxRatePercent ?? 0);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.proposalItem.deleteMany({ where: { proposalId: id } });
    return tx.proposal.update({
      where: { id },
      data: {
        subtotal: calc.subtotal,
        discount: calc.discount,
        tax: calc.tax,
        total: calc.total,
        items: {
          create: calc.items.map((i) => ({
            itemType: i.itemType,
            packageId: i.packageId,
            addonId: i.addonId,
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.total,
          })),
        },
      },
      include: { items: true },
    });
  });

  await recordAuditLog({ userId: actorId, action: "UPDATE", module: "proposals", recordId: id, newValues: updated });
  return updated;
}

export async function transitionProposal(
  id: string,
  toStatus: ProposalStatus,
  actorId: string,
  note?: string,
) {
  const proposal = await prisma.proposal.findUnique({ where: { id } });
  if (!proposal) throw new NotFoundError("Proposal");

  const allowed = ALLOWED_TRANSITIONS[proposal.status];
  if (!allowed.includes(toStatus)) {
    throw new BadRequestError(`Cannot move proposal from ${proposal.status} to ${toStatus}`);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.proposal.update({ where: { id }, data: { status: toStatus } });
    await tx.proposalStatusHistory.create({
      data: { proposalId: id, fromStatus: proposal.status, toStatus, changedBy: actorId, note },
    });
    return p;
  });

  await recordAuditLog({
    userId: actorId, action: "STATUS_CHANGE", module: "proposals", recordId: id,
    oldValues: { status: proposal.status }, newValues: { status: toStatus },
  });

  return updated;
}

export interface SaveClientProposalInput {
  companyDetails: {
    companyName: string;
    contactPerson: string;
    emailAddress?: string;
    contactNumber?: string;
    location?: string;
    industry?: string;
    requiredServices?: string;
    expectedDeliveryDate?: string;
    projectDescription?: string;
    additionalNotes?: string;
  };
  packageSelection?: {
    category?: string;
    tier?: string | null;
    ecommerce?: string | null;
  };
  packageId?: string;
  packageName?: string;
  packagePrice?: number;
  selectedAddons?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  subTotal?: number;
  vatAmount?: number;
  grandTotal?: number;
  status?: ProposalStatus;
  notes?: string;
}

export async function saveClientProposal(
  input: SaveClientProposalInput,
  actorId?: string,
) {
  // 1. Resolve sales staff ID
  let staffId = actorId;
  if (!staffId) {
    const staff = await prisma.user.findFirst({
      where: {
        role: { in: ["SALES_STAFF", "ADMIN", "SUPER_ADMIN"] },
        status: "ACTIVE",
      },
      orderBy: { createdAt: "asc" },
    });
    if (staff) {
      staffId = staff.id;
    } else {
      const anyUser = await prisma.user.findFirst();
      if (!anyUser) throw new BadRequestError("No user available to assign proposal");
      staffId = anyUser.id;
    }
  }

  const { companyDetails } = input;

  // 2. Resolve or create Lead
  let lead = null;
  if (companyDetails.emailAddress && companyDetails.emailAddress.trim()) {
    lead = await prisma.lead.findFirst({
      where: { email: { equals: companyDetails.emailAddress.trim(), mode: "insensitive" } },
    });
  }
  if (!lead && companyDetails.contactNumber && companyDetails.contactNumber.trim()) {
    lead = await prisma.lead.findFirst({
      where: { phone: companyDetails.contactNumber.trim() },
    });
  }

  if (!lead) {
    const count = await prisma.lead.count();
    const customLeadId = `LED-${1000 + count + 1}`;
    lead = await prisma.lead.create({
      data: {
        customLeadId,
        companyName: companyDetails.companyName?.trim() || "Client Proposal Prospect",
        contactPerson: companyDetails.contactPerson?.trim() || "Lead Contact",
        email: companyDetails.emailAddress?.trim() || null,
        phone: companyDetails.contactNumber?.trim() || null,
        location: companyDetails.location?.trim() || null,
        industry: companyDetails.industry?.trim() || null,
        servicesRequired: companyDetails.requiredServices?.trim() || null,
        expectedDeliveryDate: companyDetails.expectedDeliveryDate ? new Date(companyDetails.expectedDeliveryDate) : null,
        projectDescription: companyDetails.projectDescription?.trim() || null,
        additionalNotes: companyDetails.additionalNotes?.trim() || null,
        createdById: staffId,
        assignedStaffId: staffId,
        status: "NEW",
      },
    });
  }

  // 3. Resolve package and addons
  let dbPackage = null;
  if (input.packageId) {
    dbPackage = await prisma.package.findUnique({ where: { id: input.packageId } });
  }
  if (!dbPackage && input.packageName) {
    dbPackage = await prisma.package.findFirst({
      where: { name: { equals: input.packageName.trim(), mode: "insensitive" } },
    });
  }
  if (!dbPackage && input.packageSelection?.tier) {
    const tier = input.packageSelection.tier.toLowerCase();
    dbPackage = await prisma.package.findFirst({
      where: {
        OR: [
          { id: { contains: tier, mode: "insensitive" } },
          { name: { contains: tier, mode: "insensitive" } },
        ],
      },
    });
  }

  const resolvedItems: Array<{
    itemType: "PACKAGE" | "ADDON";
    packageId?: string;
    addonId?: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }> = [];

  if (dbPackage) {
    const price = Number(dbPackage.price);
    resolvedItems.push({
      itemType: "PACKAGE",
      packageId: dbPackage.id,
      name: dbPackage.name,
      quantity: 1,
      unitPrice: price,
      total: price,
    });
  } else if (input.packageName) {
    const price = Number(input.packagePrice) || 0;
    resolvedItems.push({
      itemType: "PACKAGE",
      name: input.packageName,
      quantity: 1,
      unitPrice: price,
      total: price,
    });
  }

  if (input.selectedAddons && input.selectedAddons.length > 0) {
    const addonIds = input.selectedAddons.map((a) => a.id).filter(Boolean);
    const dbAddons = await prisma.addon.findMany({
      where: { id: { in: addonIds } },
    });
    const addonMap = new Map(dbAddons.map((a) => [a.id, a]));

    for (const addonItem of input.selectedAddons) {
      const dbAddon = addonMap.get(addonItem.id);
      if (dbAddon) {
        const price = Number(dbAddon.price);
        resolvedItems.push({
          itemType: "ADDON",
          addonId: dbAddon.id,
          name: dbAddon.name,
          quantity: 1,
          unitPrice: price,
          total: price,
        });
      } else {
        const price = Number(addonItem.price) || 0;
        resolvedItems.push({
          itemType: "ADDON",
          name: addonItem.name,
          quantity: 1,
          unitPrice: price,
          total: price,
        });
      }
    }
  }

  // 4. Calculations (5% VAT UAE)
  const subtotal = Math.round(resolvedItems.reduce((sum, item) => sum + item.total, 0) * 100) / 100;
  const tax = Math.round((subtotal * 0.05) * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  // 5. Create proposal in DB
  const proposalNumber = await generateProposalNumber();
  const targetStatus: ProposalStatus = input.status === "SUBMITTED" ? "SUBMITTED" : "DRAFT";

  const proposal = await prisma.proposal.create({
    data: {
      proposalNumber,
      leadId: lead.id,
      salesStaffId: staffId,
      status: targetStatus,
      subtotal,
      discount: 0,
      tax,
      total,
      expectedDeliveryDate: lead.expectedDeliveryDate,
      projectDescription: companyDetails.projectDescription,
      notes: companyDetails.additionalNotes || input.notes,
      items: {
        create: resolvedItems.map((i) => ({
          itemType: i.itemType,
          packageId: i.packageId || null,
          addonId: i.addonId || null,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.total,
        })),
      },
      statusHistory: {
        create: {
          toStatus: targetStatus,
          changedBy: staffId,
          note: `Created from Client Portal (${targetStatus})`,
        },
      },
    },
    include: {
      items: true,
      lead: true,
      salesStaff: { select: { id: true, name: true, email: true } },
    },
  });

  // Update lead proposal details
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      proposalValue: total,
      proposalSent: targetStatus === "SUBMITTED",
      recommendedPackageId: dbPackage?.id || undefined,
    },
  }).catch(() => {});

  await recordAuditLog({
    userId: staffId,
    action: "CREATE",
    module: "proposals",
    recordId: proposal.id,
    newValues: proposal,
  });

  return proposal;
}

