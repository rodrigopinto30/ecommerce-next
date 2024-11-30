import { formatCurrency } from '@/lib/formatters';
import { Button, Column, Img, Row, Section, Text } from '@react-email/components'
import React from 'react'

type OrderInformationProps = {
  order: { id: string, createdAt: Date, pricePaidInCents: number},
  product: {imagePath: string; name: string; description: string},
  downloadVerificationId: string
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export function OrderInformation ({order, product, downloadVerificationId}: OrderInformationProps) {
  
  if (!order) {
    return <Text>Error: Order data is missing</Text>;
  }

  return (
    <>
      <Section className='bg-gray-100'>
        <Row>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap'>Order ID</Text>
            <Text className='mt-0'>{order.id}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap'>Purchased On</Text>
            <Text className='mt-0'>{dateFormatter.format(order.createdAt)}</Text>
          </Column>
          <Column>
            <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap'>Price Paid</Text>
            <Text className='mt-0'>{formatCurrency(order.pricePaidInCents / 100)}</Text>
          </Column>
        </Row>
      </Section>
      <Section className='border boreder-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
        <Img
          width="100%"
          alt={product.name}
          src={"http://localhost:3000" + `${product.imagePath}`}
          />
          <Row className='mt-8'>
            <Column className='align-bottom'>
              <Text className="text-lg font-bold m-0 mr-4">{product.name}</Text>
            </Column>
            <Column align='right'>
              <Button 
                href={"http://localhost:3000"+`/products/download/${downloadVerificationId}`}
                className="bg-black text-white px-6 py-4 rounded text-lg">
                Download
              </Button>
            </Column>
          </Row>
          <Row>
            <Column>
              <Text className='text-gray-500 mb-0'>{product.description}</Text>
            </Column>
          </Row>
      </Section>
    </>
  )
}

export default OrderInformation