import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Tailwind } from '@react-email/components';
import OrderInformation from './components/OrderInformation';
import { v4 as uuidv4 } from 'uuid';

type PurchaseReceiptEmailProps = {
    product: {
        name: string; 
        description: string,
        imagePath: string
    },
    order: { 
        id: string; 
        createdAt: Date; 
        pricePaidInCents: number;
    },
    downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
    product: {
        name: "Product name",
        description: "Some description",
        imagePath: "/public/products/50041951-0f87-4274-aa33-8a21b4c9ca52-especie-variedad.png"
    },
    order: {
        id: uuidv4(),
        createdAt: new Date(),
        pricePaidInCents: 10000
    },
    downloadVerificationId: uuidv4()
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail({ 
    product, 
    order, 
    downloadVerificationId 
}: PurchaseReceiptEmailProps) {
    
    return (
        <Html>
            <Preview>Download {product.name}</Preview>
            <Tailwind>
                <Head />
                <Body className='font-sans bg-white'>
                    <Container className="w-full">
                        <Heading>Purchase Receipt</Heading>
                        <OrderInformation 
                            order={order}
                            product={product}
                            downloadVerificationId={downloadVerificationId}
                        />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
