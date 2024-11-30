import React from 'react'
import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind } from '@react-email/components';
import OrderInformation from './components/OrderInformation';
import { v4 as uuidv4 } from 'uuid';

type OrderHistoryEmailProps = {
    orders: {
        id: string,
        pricePaidInCents: number,
        createdAt: Date,
        downloadVerificationId: string,
        product: {
            name: string; 
            description: string,
            imagePath: string
        }
    }[]
}

OrderHistoryEmail.PreviewProps = {
    orders:[
        {
            id: uuidv4(),
            createdAt: new Date(),
            pricePaidInCents: 10000,
            downloadVerificationId: uuidv4(),
            product: {
                name: "Product name",
                description: "Some description",
                imagePath: "/products/50041951-0f87-4274-aa33-8a21b4c9ca52-especie-variedad.png"
            },
        },
        {
            id: uuidv4(),
            createdAt: new Date(),
            pricePaidInCents: 2000,
            downloadVerificationId: uuidv4(),
            product: {
                name: "Product name 2",
                description: "Some other description",
                imagePath: "/products/50041951-0f87-4274-aa33-8a21b4c9ca52-especie-variedad.png"
            },
        }
    ]
} satisfies OrderHistoryEmailProps

export default function OrderHistoryEmail({ 
    orders
}: OrderHistoryEmailProps) {
    
    return (
        <Html>
         <Preview>Order History & Download</Preview>
         <Tailwind>
             <Head />
             <Body className='font-sans bg-white'>
                 <Container className="w-full">
                     <Heading>Order History</Heading>
                     {orders.map((order, index) =>(
                        <React.Fragment key={order.id}>
                        <OrderInformation 
                        order={order}
                        product={order.product}
                        downloadVerificationId={order.downloadVerificationId}
                        />
                        {index < orders.length - 1 && <Hr/>}
                        </React.Fragment>
                     ))}
                 </Container>
             </Body>
         </Tailwind>
        </Html>
    )
}
