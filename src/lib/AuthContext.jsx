import React, {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { base44 } from '@/api/base44Client'
export const UserNotRegisteredError = 'UserNotRegisteredError'
const AuthContext=createContext(null)
export function AuthProvider({children}){
  const navigate=useNavigate(); const [user,setUser]=useState(null); const [isLoadingAuth,setIsLoadingAuth]=useState(true); const [isLoadingPublicSettings,setIsLoadingPublicSettings]=useState(true); const [authError,setAuthError]=useState(null); const [appPublicSettings,setAppPublicSettings]=useState(null)
  useEffect(()=>{ (async()=>{ try { setAppPublicSettings(await base44.app.getPublicSettings()); const me=await base44.auth.me(); setUser(me||null) } catch(e){setAuthError(e)} finally {setIsLoadingPublicSettings(false);setIsLoadingAuth(false)} })() },[])
  const logout=useCallback(async()=>{await base44.auth.logout();setUser(null);navigate('/')},[navigate])
  const navigateToLogin=useCallback((path='/')=>navigate(`/login?returnTo=${encodeURIComponent(path)}`),[navigate])
  const checkUserAuth=useCallback(async()=>{const me=await base44.auth.me();setUser(me||null);return me},[])
  const checkAppState=useCallback(async()=>true,[])
  const value=useMemo(()=>({user,isAuthenticated:!!user,isLoadingAuth,isLoadingPublicSettings,authError,appPublicSettings,authChecked:!isLoadingAuth,logout,navigateToLogin,checkUserAuth,checkAppState}),[user,isLoadingAuth,isLoadingPublicSettings,authError,appPublicSettings,logout,navigateToLogin,checkUserAuth,checkAppState])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth(){return useContext(AuthContext)}
export default AuthContext
