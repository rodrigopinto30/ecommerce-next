import React, { Suspense } from 'react'
import Layout from './layout'
import db from '@/db/db'
import { Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { cache } from '@/lib/cache';

const getMostPopularProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: "desc" } },
    take: 6
  })
}, ["/", "getMostPopularProducts"], {revalidated: 60 * 60 * 24});

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6
  })
}, ["/", "getNewestProducts"]);
// 2:10:10

const HomePage = () => {
  return (
    <main className='space-y-12'>
      <ProductGridSection
        productsFetcher={getMostPopularProducts}
        title='Most Popular'
      />
      <ProductGridSection
        productsFetcher={getNewestProducts}
        title='Newest'
      />
    </main>
  )
}
export default HomePage


type ProductGridSectionProps = {
  productsFetcher: () => Promise<Product[]>
  title: string
}

const ProductGridSection = ({ productsFetcher, title }: ProductGridSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">
          {title}
        </h2>
        <Button variant="outline" asChild>
          <Link href="/products" className='space-x-2'>
            <span>View All</span>
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }>
          <ProductSuspense productsFetcher={productsFetcher}/>
        </Suspense>
      </div>
    </div>
  )
}

const ProductSuspense = async ({ productsFetcher }: { productsFetcher: () => Promise<Product[]> }) => {
  return (await productsFetcher()).map(product => (
    <ProductCard
      pricePaidInCents={0} key={product.id}
      {...product} />
  ))
}