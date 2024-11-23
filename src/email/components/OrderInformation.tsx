import { formatCurrency } from '@/lib/formatters';
import { Column, Row, Section, Text } from '@react-email/components'
import React from 'react'

type OrderInformationProps = {
  order: { id: string, createdAt: Date, pricePaidIncents: number},
  product: {name: string},
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
            <Text className='mt-0'>{formatCurrency(order.pricePaidIncents / 100)}</Text>
          </Column>
        </Row>
      </Section>
      <Section className='border boreder-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
        <Img src={product.img}/>
      </Section>
    </>
  )
}

export default OrderInformation