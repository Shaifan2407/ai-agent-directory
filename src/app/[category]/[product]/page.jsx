import { notFound } from "next/navigation"
import ProductDetails from "./ProductDetails"

async function getProductData(category, product) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${category}/${product}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default async function ProductPage({ params }) {
  try {
    const {category, product} = await params
    const productData = await getProductData(category, product)
    return <ProductDetails productData={productData} />
  } catch (error) {
    notFound()
  }
}