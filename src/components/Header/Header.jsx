import React, { useEffect, useState } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import authService from "../../appwrite/auth"
import { logout } from '../../store/authSlice'


const Header = () => {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation();
  const userData = useSelector((state) => state.auth.userData)
  const [currUser, setCurrUser] = useState(localStorage.getItem('currUser') || 'Guest')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        console.log(currentUser)
        if (currentUser && currentUser.name) {
          setCurrUser(currentUser.name)
          localStorage.setItem('currUser', currentUser.name)  // Assuming "name" is the field for the user's name
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    if (!userData) {
      fetchUserData();
    }
  }, [dispatch, userData]);

  const logoutHandler = async () => {
    try {
      await authService.logout()  // Assuming this is your logout function
      dispatch(logout())          // Dispatching the logout action to clear Redux state
      setCurrUser('Guest')        // Resetting the user name to "Guest"
      navigate('/login')          // Redirect to the login page after logout
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }



  const navItems = [

    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]
  return (

    <header className='py-4 xsm:h-32 sm:h-20  shadow bg-[#8EACCD]'>
      <Container>
        <nav className='flex flex-col gap-2 sm:flex-row '>
          <div className=' xsm:mx-auto ml-10 xsm:mr-56  sm:mr-36 '>
            <Link to='/'>
              <Logo width='120px' />

            </Link>
          </div>
          <ul className=' flex items-center justify-center mx-auto ml-auto flex-col gap-3 xsm:gap-0 xsm:flex-row text-sm xs:text-lg'>


            <div className='flex  bg-[#FEF9D9] border-yellow-400 rounded text-green-600 text-xl border px-10 mr-5 justify-center  text-center items-center pr-10'>{currUser}</div>




            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`inline-block px-6 py-2 duration-200 rounded-full ${location.pathname === item.slug ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-100'
                      }`}
                  >{item.name}</button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <button onClick={logoutHandler} className='inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
