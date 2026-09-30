import { ProductDetailLoader } from "@/components/product-detail-loader";
import { products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return { title: product?.name ?? "Produit" };
}

export default async function ProductPage({ params }: PageProps<"/produit/[slug]">) {
  const { slug } = await params;
  return <ProductDetailLoader slug={slug} />;
}
