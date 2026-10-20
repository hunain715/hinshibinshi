import React from 'react'
const listeners=[]; let state={toasts:[]}
function emit(){listeners.forEach(l=>l(state))}
export function toast({title,description,duration=3500}){const id=Math.random().toString(36).slice(2); const item={id,title,description}; state={toasts:[...state.toasts,item]};emit();setTimeout(()=>{state={toasts:state.toasts.filter(t=>t.id!==id)};emit()},duration);return {id,dismiss:()=>{state={toasts:state.toasts.filter(t=>t.id!==id)};emit()}}}
export function useToast(){const [s,setS]=React.useState(state);React.useEffect(()=>{listeners.push(setS);return()=>{const i=listeners.indexOf(setS);if(i>=0)listeners.splice(i,1)}},[]);return {toasts:s.toasts,toast,dismiss:(id)=>{state={toasts:state.toasts.filter(t=>t.id!==id)};emit()}}}
