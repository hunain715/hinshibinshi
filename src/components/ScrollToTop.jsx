import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
export default function ScrollToTop(){ const {pathname,hash}=useLocation(); const navType=useNavigationType(); useEffect(()=>{ if(hash){const el=document.getElementById(hash.slice(1)); if(el){el.scrollIntoView();return}} if(navType!=='POP') window.scrollTo({top:0,left:0,behavior:'instant'}) },[pathname,hash,navType]); return null }
