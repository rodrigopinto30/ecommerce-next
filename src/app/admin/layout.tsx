import React from 'react'
import { Nav, NavLink } from '../components/Nav';

export const dynamic = "force-dynamic";

const AdminLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <Nav>
                <NavLink href="/admin/">Dashboard</NavLink>
                <NavLink href="/admin/products">Products</NavLink>
                <NavLink href="/admin/users">Customers</NavLink>
                <NavLink href="/admin/orders">Sales</NavLink>
            </Nav>
            <div className='container m-10'>
                {children}
            </div>
        </>
    )
}

export default AdminLayout