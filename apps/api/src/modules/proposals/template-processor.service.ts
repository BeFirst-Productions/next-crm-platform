import Handlebars from "handlebars";
import { uploadToCloudinary, getOptimizedImageUrl } from "@/common/utils/cloudinary";

export interface ProposalTemplateData {
  proposalNumber: string;
  date: string;
  validUntil?: string;
  clientCompany: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  salesStaffName: string;
  salesStaffEmail: string;
  categoryName: string;
  packageName: string;
  packagePrice: string;
  packageBillingType: string;
  packageFeatures: Array<{ featureName: string; featureValue?: string | null; included: boolean }>;
  addons: Array<{ name: string; quantity: number; unitPrice: string; total: string }>;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  projectDescription?: string;
  notes?: string;
  bgImageUrl?: string;
  sealImageUrl?: string;
}

/**
 * Standard default HTML Proposal Template embedded with modern glassmorphism design,
 * header branding layer, responsive package & addons breakdown table, official seal/stamp area,
 * and signature block.
 */
export const DEFAULT_PROPOSAL_HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Proposal {{proposalNumber}}</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    body {
      background-color: #0f172a;
      color: #f8fafc;
      width: 210mm;
      min-height: 297mm;
      padding: 40px;
      position: relative;
      background-image: {{#if bgImageUrl}}url('{{bgImageUrl}}'){{else}}none{{/if}};
      background-size: cover;
      background-position: center;
    }
    .watermark-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 60%);
      pointer-events: none;
    }
    .container {
      position: relative;
      z-index: 10;
      max-width: 100%;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 32px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #ffffff;
    }
    .brand-subtitle {
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .proposal-badge {
      background: rgba(0, 163, 255, 0.15);
      border: 1px solid rgba(0, 163, 255, 0.4);
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 700;
      color: #38bdf8;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    .card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
    }
    .card-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 12px;
      font-weight: 700;
    }
    .card-body p {
      font-size: 14px;
      line-height: 1.6;
      color: #e2e8f0;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #f8fafc;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
      background: rgba(30, 41, 59, 0.6);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    th {
      background: rgba(15, 23, 42, 0.8);
      color: #94a3b8;
      text-align: left;
      padding: 14px 18px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    td {
      padding: 14px 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 14px;
      color: #cbd5e1;
    }
    .features-list {
      list-style: none;
      margin-top: 8px;
    }
    .features-list li {
      font-size: 13px;
      color: #94a3b8;
      padding: 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .features-list li::before {
      content: "✓";
      color: #10b981;
      font-weight: bold;
    }
    .total-box {
      margin-left: auto;
      width: 320px;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 32px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
      color: #94a3b8;
    }
    .total-row.grand {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      margin-top: 8px;
      padding-top: 12px;
      font-size: 18px;
      font-weight: 800;
      color: #f8fafc;
    }
    .signature-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .stamp-box {
      width: 140px;
      height: 90px;
      border: 2px dashed rgba(99, 102, 241, 0.4);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #818cf8;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      background: rgba(99, 102, 241, 0.05);
    }
    .signature-line {
      text-align: center;
      width: 200px;
    }
    .signature-line .line {
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      height: 40px;
      margin-bottom: 8px;
    }
    .signature-line p {
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="watermark-overlay"></div>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand-title">nEXT | befirst</div>
        <div class="brand-subtitle">A DIVISION OF BEFIRST MEDIA PRODUCTIONS</div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Service Category: {{categoryName}} | www.nextmedia.ae</p>
      </div>
      <div class="proposal-badge">{{proposalNumber}}</div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">Prepared For Client</div>
        <div class="card-body">
          <p style="font-weight: 700; font-size: 16px; color: #f8fafc;">{{clientCompany}}</p>
          <p>Contact: {{clientName}}</p>
          <p>Email: {{clientEmail}}</p>
          {{#if clientPhone}}<p>Phone: {{clientPhone}}</p>{{/if}}
        </div>
      </div>
      <div class="card">
        <div class="card-title">Proposal Overview</div>
        <div class="card-body">
          <p><strong>Issued Date:</strong> {{date}}</p>
          {{#if validUntil}}<p><strong>Valid Until:</strong> {{validUntil}}</p>{{/if}}
          <p><strong>Prepared By:</strong> {{salesStaffName}} ({{salesStaffEmail}})</p>
        </div>
      </div>
    </div>

    {{#if projectDescription}}
    <div class="card" style="margin-bottom: 32px;">
      <div class="card-title">Project Scope & Scope Description</div>
      <div class="card-body">
        <p>{{projectDescription}}</p>
      </div>
    </div>
    {{/if}}

    <div class="section-title">Selected Package & Deliverables</div>
    <table>
      <thead>
        <tr>
          <th>Service / Package</th>
          <th>Billing Structure</th>
          <th>Features Included</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong style="color: #f8fafc; font-size: 15px;">{{packageName}}</strong>
          </td>
          <td>{{packageBillingType}}</td>
          <td>
            <ul class="features-list">
              {{#each packageFeatures}}
                {{#if this.included}}
                  <li>{{this.featureName}}{{#if this.featureValue}}: {{this.featureValue}}{{/if}}</li>
                {{/if}}
              {{/each}}
            </ul>
          </td>
          <td style="text-align: right; font-weight: 700; color: #f8fafc;">\${{packagePrice}}</td>
        </tr>
      </tbody>
    </table>

    {{#if addons.length}}
    <div class="section-title">Additional Add-ons & Custom Enhancements</div>
    <table>
      <thead>
        <tr>
          <th>Addon Module</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {{#each addons}}
        <tr>
          <td><strong style="color: #f8fafc;">{{this.name}}</strong></td>
          <td style="text-align: center;">{{this.quantity}}</td>
          <td style="text-align: right;">\${{this.unitPrice}}</td>
          <td style="text-align: right; font-weight: 600; color: #f8fafc;">\${{this.total}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>
    {{/if}}

    <div class="total-box">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>\${{subtotal}}</span>
      </div>
      {{#if discount}}
      <div class="total-row">
        <span>Discount:</span>
        <span style="color: #10b981;">-\${{discount}}</span>
      </div>
      {{/if}}
      {{#if tax}}
      <div class="total-row">
        <span>Tax / VAT:</span>
        <span>+\${{tax}}</span>
      </div>
      {{/if}}
      <div class="total-row grand">
        <span>Total Investment:</span>
        <span>\${{total}}</span>
      </div>
    </div>

    <div style="margin: 24px 0; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 18px;">
      <div style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Commercial Terms &amp; Payment Schedule</div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 12px;">
        <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
          <div style="font-weight: 800; color: #38bdf8; font-size: 14px;">50%</div>
          <div style="color: #cbd5e1; margin-top: 2px;">Project Confirmation</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
          <div style="font-weight: 800; color: #38bdf8; font-size: 14px;">30%</div>
          <div style="color: #cbd5e1; margin-top: 2px;">Development Milestone</div>
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
          <div style="font-weight: 800; color: #38bdf8; font-size: 14px;">20%</div>
          <div style="color: #cbd5e1; margin-top: 2px;">Final Handover &amp; Live</div>
        </div>
      </div>
      <div style="font-size: 11px; color: #94a3b8; margin-top: 10px;">Includes 30 days post-launch technical support &amp; warranty. Deliverables handed over upon full payment.</div>
    </div>

    {{#if notes}}
    <p style="font-size: 13px; color: #94a3b8; font-style: italic; margin-bottom: 24px;">
      Note: {{notes}}
    </p>
    {{/if}}

    <div class="signature-area">
      <div class="stamp-box">
        {{#if sealImageUrl}}
          <img src="{{sealImageUrl}}" alt="Official Seal" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
        {{else}}
          OFFICIAL SEAL STAMP
        {{/if}}
      </div>
      <div class="signature-line">
        <div class="line"></div>
        <p>Authorized Signature</p>
      </div>
      <div class="signature-line">
        <div class="line"></div>
        <p>Client Acceptance</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

/**
 * Processes an uploaded PDF template or artwork buffer, uploads compressed background to Cloudinary,
 * and saves the generated Handlebars HTML template structure for the given category.
 */
export async function processCategoryTemplateUpload(params: {
  categoryId: string;
  fileBuffer: Buffer;
  fileName: string;
  customHtml?: string;
}) {
  // 1. Upload raw/background asset to Cloudinary with compression flags
  const uploadResult = await uploadToCloudinary(params.fileBuffer, {
    folder: `next-crm/category-templates/${params.categoryId}`,
    publicId: `template_bg_${Date.now()}`,
    resourceType: "auto",
  });

  const compressedBgUrl = getOptimizedImageUrl(uploadResult.url);

  // 2. Prepare HTML template
  const templateHtml = params.customHtml || DEFAULT_PROPOSAL_HTML_TEMPLATE;

  return {
    templatePdfUrl: uploadResult.url,
    compressedBgUrl,
    templateHtml,
  };
}

/**
 * Compiles dynamic proposal data into final HTML output using Handlebars template engine.
 */
export function compileProposalHtml(templateHtml: string, data: ProposalTemplateData): string {
  const compiledTemplate = Handlebars.compile(templateHtml || DEFAULT_PROPOSAL_HTML_TEMPLATE);
  return compiledTemplate(data);
}
