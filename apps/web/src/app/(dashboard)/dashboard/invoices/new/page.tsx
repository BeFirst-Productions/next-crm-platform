import { Metadata } from "next";
import { InvoiceGenerator } from "@/components/invoices/InvoiceGenerator";

export const metadata: Metadata = {
  title: "Invoice Generator — Next Digital CRM",
  description: "Sales Staff Invoice Generator and client billing wizard",
};

export default function NewInvoicePage() {
  return <InvoiceGenerator />;
}
