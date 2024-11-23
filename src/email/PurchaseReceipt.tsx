import React from 'react'
import { Body, Container, Head, Heading, Html, Preview, Tailwind } from '@react-email/components';
import OrderInformation from './components/OrderInformation';
import { v4 as uuidv4 } from 'uuid';

type PurchaseReceiptEmailProps = {
    product: {
        name: string
    },
    order: { 
        id: string; 
        createdAt: Date; 
        pricePaidIncents: number;
    },
    downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
    product: {
        name: "Product name"
    },
    order: {
        id: uuidv4(),
        createdAt: new Date(),
        pricePaidIncents: 10000
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
