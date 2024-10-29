import { ProductCard, ProductCardSkeleton } from '@/app/components/ProductCard'
import db from '@/db/db'
import { cache } from '@/lib/cache';
import React, { Suspense } from 'react'

const getProducts = cache(() => {
    return db.product.findMany({
        where: {
            isAvailableForPurchase: true
        },
        orderBy: {
            name: "asc"
        }
    })
}, ["/products", "getProducts"]);

const ProductPage = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Suspense fallback={
                <>
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                </>
            }>
                <ProductsSuspense />
            </Suspense>
        </div>
    )
}

export default ProductPage

const ProductsSuspense = async () => {
    const products = await getProducts();
    return products.map(product => <ProductCard
        pricePaidInCents={0} key={product.id}
        {...product} />)
}