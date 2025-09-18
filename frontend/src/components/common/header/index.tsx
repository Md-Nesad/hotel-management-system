import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../ui/Button'
import logo from '../../../assets/bahamas-logo.png'
import { useState } from 'react'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isAuthenticated = !!localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className='w-full bg-[#000000] shadow-sm border-b border-gray-100 fixed top-0 z-50'>
      <div className='max-w-6xl mx-auto px-4 sm:px-10 lg:px-12'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center'>
            <img
              src={logo}
              alt='Bahamas Logo'
              className='h-9 sm:h-14 bg-black object-contain mt-2 sm:mt-0 rounded'
            />
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden md:flex items-center gap-6'>
            <Link
              to='/'
              className={`${
                location.pathname === '/'
                  ? 'text-[var(--color-orange)] font-medium'
                  : 'text-gray-200'
              } hover:text-[var(--color-gold)] font-inter transition-colors duration-200`}
            >
              Lodge
            </Link>
            <Link
              to='/resturant-bar'
              className={`${
                location.pathname === '/resturant-bar'
                  ? 'text-[var(--color-orange)] font-medium'
                  : 'text-gray-200'
              } hover:text-[var(--color-gold)] font-inter transition-colors duration-200`}
            >
              Restaurant & Bar
            </Link>

            <div className='flex flex-wrap sm:gap-4 max-sm:pb-3'>
              {isAuthenticated ? (
                role === 'admin' ? (
                  <button className='bg-[#F9862D] hover:bg-orange-500 hover:opacity-90 text-[#FFFFFF] font-inter font-medium px-3 py-1.5 sm:px-6 sm:py-2 rounded text-sm transition-all duration-200 shadow-sm cursor-pointer'>
                    Dashboard
                  </button>
                ) : (
                  <button className='bg-[#F9862D] hover:bg-orange-500 hover:opacity-90 text-[#FFFFFF] font-inter font-medium px-3 py-1.5 sm:px-6 sm:py-2 rounded text-sm transition-all duration-200 shadow-sm cursor-pointer'>
                    Logout
                  </button>
                )
              ) : (
                <button className='bg-[#F9862D] hover:bg-orange-500 hover:opacity-90 text-[#FFFFFF] font-inter font-medium px-3 py-1.5 sm:px-6 sm:py-2 rounded text-sm transition-all duration-200 shadow-sm cursor-pointer'>
                  Login
                </button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='sm'
              className='text-white hover:text-[var(--color-gold)] p-2 rounded-full focus:outline-none'
              onClick={toggleMobileMenu}
              aria-label='Toggle menu'
            >
              <span aria-label='Open menu' className='text-2xl'>
                ☰
              </span>
            </Button>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className='absolute top-16 right-4 w-52 bg-white shadow-xl rounded-lg py-3 z-50 border border-gray-200'>
                <Link
                  to='/'
                  onClick={toggleMobileMenu}
                  className={`${
                    location.pathname === '/'
                      ? 'block px-4 py-2 text-[var(--color-orange)] font-medium bg-gray-50'
                      : 'block px-4 py-2 text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-100'
                  } transition duration-200`}
                >
                  Lodge
                </Link>
                <Link
                  to='/resturant-bar'
                  onClick={toggleMobileMenu}
                  className={`${
                    location.pathname === '/resturant-bar'
                      ? 'block px-4 py-2 text-[var(--color-orange)] font-medium bg-gray-50'
                      : 'block px-4 py-2 text-gray-700 hover:text-[var(--color-gold)] hover:bg-gray-100'
                  } transition duration-200`}
                >
                  Restaurant & Bar
                </Link>

                <div className='px-4 pt-2 flex flex-col space-y-2'>
                  <button
                    onClick={() => navigate('/login')}
                    className={`${
                      location.pathname === '/login'
                        ? 'text-[var(--color-orange)] font-medium'
                        : 'text-black'
                    } hover:text-[var(--color-gold)] font-inter transition-colors duration-200 text-start cursor-pointer`}
                  >
                    Log In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
