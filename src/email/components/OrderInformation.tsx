import React from 'react'

type OrderInformationProps = {
  order: {},
  product: {},
  downloadVerificationId: string
}

const OrderInformation = ({order, product, downloadVerificationId}: OrderInformationProps) => {
  return (
    <h1>Hola este es un H1</h1>
  )
}

export default OrderInformation