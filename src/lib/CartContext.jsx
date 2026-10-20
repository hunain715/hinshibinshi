import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
const STORAGE_KEY = 'hb_cart_v1'
function readItems(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const CartContext=createContext(null)
export function CartProvider({children}){
  const [items,setItems]=useState(readItems)
  const persist=useCallback((next)=>{ setItems(next); localStorage.setItem(STORAGE_KEY,JSON.stringify(next)) },[])
  const addItem=useCallback((product,quantity=1)=>{ const id=product.id; const next=items.slice(); const i=next.findIndex(x=>x.product_id===id); const salePrice=Number(product.sale_price); const regularPrice=Number(product.price); const row={product_id:id,title:product.title,price:salePrice>0?salePrice:regularPrice,quantity:1,image:product.primary_image || product.images?.[0] || ''}; if(i>=0) next[i]={...next[i],quantity:next[i].quantity+quantity}; else next.push({...row,quantity}); persist(next) },[items,persist])
  const setQuantity=useCallback((id,quantity)=>{const next=items.map(x=>x.product_id===id?{...x,quantity}:x).filter(x=>x.quantity>0);persist(next)},[items,persist])
  const removeItem=useCallback(id=>persist(items.filter(x=>x.product_id!==id)),[items,persist])
  const clearCart=useCallback(()=>persist([]),[persist])
  const value=useMemo(()=>({items,addItem,setQuantity,removeItem,clearCart,count:items.reduce((n,x)=>n+x.quantity,0),subtotal:items.reduce((n,x)=>n+x.price*x.quantity,0)}),[items,addItem,setQuantity,removeItem,clearCart])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
export function useCart(){ const c=useContext(CartContext); if(!c) throw new Error('useCart must be used within CartProvider'); return c }
export default CartContext
