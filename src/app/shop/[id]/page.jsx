import ProductDetails from '@/components/productDetails/ProductDetails'
import React from 'react'

const ProductDetailsPage = ({ params }) => {
  return (
    <div>
      <ProductDetails params={params} />
    </div>
  )
}

export default ProductDetailsPage
