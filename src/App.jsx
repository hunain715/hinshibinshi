import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageNotFound from '@/lib/PageNotFound'
import { AuthProvider } from '@/lib/AuthContext'
import ScrollToTop from '@/components/ScrollToTop'
import CustomerLayout from '@/components/CustomerLayout'
import AdminRoute from '@/components/admin/AdminRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import { CartProvider } from '@/lib/CartContext'
import Home from '@/pages/Home'
import Hardware from '@/pages/Hardware'
import Software from '@/pages/Software'
import Contact from '@/pages/Contact'
import Products from '@/pages/Products'
import ProductDetail from '@/pages/ProductDetail'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Dashboard from '@/pages/admin/Dashboard'
import AdminProducts from '@/pages/admin/Products'
import Categories from '@/pages/admin/Categories'
import Orders from '@/pages/admin/Orders'
import OrderDetail from '@/pages/admin/OrderDetail'
import Customers from '@/pages/admin/Customers'
import CustomerDetail from '@/pages/admin/CustomerDetail.jsx'
import AdminSettings from '@/pages/admin/Settings'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'

function AuthenticatedApp(){
  return <CartProvider><Routes>
    <Route element={<CustomerLayout />}>
      <Route path="/" element={<Home/>}/><Route path="/hardware" element={<Hardware/>}/><Route path="/software" element={<Software/>}/><Route path="/contact" element={<Contact/>}/><Route path="/products" element={<Products/>}/><Route path="/product/:slug" element={<ProductDetail/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/order-confirmation/:id" element={<OrderConfirmation/>}/>
    </Route>
    <Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/reset-password" element={<ResetPassword/>}/>
    <Route path="/admin" element={<AdminRoute><AdminLayout/></AdminRoute>}><Route index element={<Dashboard/>}/><Route path="products" element={<AdminProducts/>}/><Route path="categories" element={<Categories/>}/><Route path="orders" element={<Orders/>}/><Route path="orders/:id" element={<OrderDetail/>}/><Route path="customers" element={<Customers/>}/><Route path="customers/:id" element={<CustomerDetail/>}/><Route path="settings" element={<AdminSettings/>}/></Route>
    <Route path="*" element={<PageNotFound/>}/>
  </Routes></CartProvider>
}
export default function App(){return <QueryClientProvider client={queryClientInstance}><BrowserRouter><AuthProvider><ScrollToTop/><AuthenticatedApp/></AuthProvider><Toaster/></BrowserRouter></QueryClientProvider>}
