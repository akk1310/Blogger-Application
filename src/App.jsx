import './App.css'
import { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login,logout } from './store/authSlice';
import authService from './appwrite/auth';
import { Outlet } from 'react-router-dom';
import {Header} from './components/index'
import {Footer} from './components/index'



function App() {
  const [loading,setLoading] = useState(true)
  const dispatch = useDispatch()
  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData)=>{
      if(userData){
        dispatch(login({userData}))
      }
      else{
        dispatch(logout())
      }
    })
    .finally(()=>setLoading(false))

  },[])

  return !loading ? <div className='bg-[#D2E0FB] min-h-screen flex flex-wrap content-between'>
    <div className='w-full block'> 
      <Header />
      <main>
      <Outlet />
      </main>
      <Footer />
      </div>
  </div> : <div class=" mx-auto mt-52 circle-loader"></div>
    
}

export default App
