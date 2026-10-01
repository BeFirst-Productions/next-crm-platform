import { Metadata } from "next";
import { SalesReport } from "@/components/reports/SalesReport";

export const metadata: Metadata = {
  title: "Sales Report — Next Digital CRM",
  description: "Detailed analysis of sales activities, performance, and conversions",
};

export default function ReportsPage() {
  return <SalesReport />;
}
