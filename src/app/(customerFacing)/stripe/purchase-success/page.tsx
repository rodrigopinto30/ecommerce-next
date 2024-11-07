import db from '@/db/db'
import { formatCurrency } from '@/lib/formatters'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const SuccessPage = async ({searchParams}: {searchParams: {payment_intent: string}}) => {
  
    const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent);
    if(paymentIntent.metadata.productId == null) return notFound();

    const product = await db.product.findUnique({ where: { id: paymentIntent.metadata.productId }})
    if(product == null) return notFound();

    const isSuccess = paymentIntent.status === "succeeded";
  //2:40
    return (
    <div className='max-w-5xl w-full mx-auto space-y-8'>
        <h1 className='text-4xl font-bold'>
            {isSuccess ? "Success!" : "Error!"}
        </h1>
    <div className="flex gap-4 items-center">
      <div className="aspect-video flex-shrink-0 w-1/3 relative">
        <Image
          src={product.imagePath}
          fill
          alt={product.name}
          className='object-cover'
        />
      </div>
      <div>
        <div className='text-lg'>
          {formatCurrency(product.priceInCents / 100)}
        </div>
        <h1 className='text-2xl font-bold'>{product.name}</h1>
        <div className='line-clamp-3 text-muted-foreground'>
          {product.description}
        </div>
      </div>
    </div>
  </div>
  )
}

export default SuccessPage