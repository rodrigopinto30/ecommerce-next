import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Tailwind } from '@react-email/components';
import OrderInformation from './components/OrderInformation';

type PurchaseReceiptEmailProps = {
    product: {
        name: string
    }
}

PurchaseReceiptEmail.PreviewProps = {
    product: {
        name: "Product name"
    }
} satisfies PurchaseReceiptEmailProps

export function  PurchaseReceiptEmail  ({product}: PurchaseReceiptEmailProps) {
  return (
    <Html>
        <Preview>Download {product.name}</Preview>
        <Tailwind>
            <Head />
            <Body className='font-sans bg-white'>
                <Container className="max-w-1">
                    <Heading>Purchase Receipt</Heading>
                    <OrderInformation />
                </Container>
            </Body>
        </Tailwind>
    </Html>
  )
}
