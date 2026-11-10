import type { Metadata } from "next";
import { ProductsScreen } from "@/components/ProductsScreen";

export const metadata: Metadata = { title: "Products · Copymopy" };

export default function ProductsPage() {
  return <ProductsScreen />;
}
