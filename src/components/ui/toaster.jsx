import React from 'react'; import {useToast} from './use-toast'; import {Toast,ToastViewport,ToastTitle,ToastDescription,ToastClose} from './toast'
export function Toaster(){const {toasts,dismiss}=useToast();return <ToastViewport>{toasts.map(t=><Toast key={t.id}><ToastTitle>{t.title}</ToastTitle>{t.description&&<ToastDescription>{t.description}</ToastDescription>}<ToastClose onClick={()=>dismiss(t.id)}/></Toast>)}</ToastViewport>}
export default Toaster
