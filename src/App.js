import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { IoNotifications } from 'react-icons/io5';
import { useAuth } from './components/authContext';

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Check if the current route is the login or registration page
    const isLoginPage = location.pathname === '/';
    const isRegistrationPage = location.pathname === '/registration';

    // Toggle menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        logout(); // Update user context to null
        navigate('/'); // Redirect to the login page
    };

    return (
        <div className='h-dvh'>
            {/* Conditionally render the nav bar based on the current path */}
            {!isLoginPage && !isRegistrationPage && (
                <nav className='bg-sky-950 text-white p-4 shadow-md'>
                    <div className='w-full px-2 sm:px-6 lg:px-8'>
                        <div className='flex justify-between items-center'>
                            <div className='text-3xl font-bold font-quicksand'>
                                <Link to='/main'>H-TownHelps</Link>
                            </div>

                            {/* Hamburger Button for Mobile */}
                            <div className='sm:hidden'>
                                <button
                                    onClick={toggleMenu}
                                    className='block text-white focus:outline-none'
                                >
                                    <svg
                                        className='h-6 w-6'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth='2'
                                            d='M4 6h16M4 12h16m-7 6h7'
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Regular Nav Links */}
                            <div className='hidden sm:flex space-x-6 sm:items-center sm:justify-center'>
                                <Link
                                    to='/userprofile'
                                    className='hover:underline'
                                >
                                    User Profile Page
                                </Link>
                                <Link to='/events' className='hover:underline'>
                                    Events Page
                                </Link>
                                <Link
                                    to='/volunteer-match'
                                    className='hover:underline'
                                >
                                    Volunteer Matching Page
                                </Link>
                                <Link
                                    to='/volunteerhist'
                                    className='hover:underline'
                                >
                                    Volunteer History Page
                                </Link>
                                <Link
                                    to='/notifications'
                                    className='hover:underline hover:scale-105 duration-200'
                                >
                                    <IoNotifications size={25} />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className='hover:underline bg-red-500 text-white px-2 py-1 rounded-md '
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {isMenuOpen && (
                            <div className='sm:hidden mt-4'>
                                <ul className='space-y-4'>
                                    <li>
                                        <Link
                                            to='/userprofile'
                                            className='block hover:underline'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            User Profile Page
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to='/events'
                                            className='block hover:underline'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Events Page
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to='/volunteer-match'
                                            className='block hover:underline'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Volunteer Matching Page
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to='/notifications'
                                            className='block hover:underline'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Notifications Page
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to='/volunteerhist'
                                            className='block hover:underline'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Volunteer History Page
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>
            )}

            {/* Show only the Login link on the registration page */}
            {isRegistrationPage && (
                <nav className='bg-blue-600 text-white p-4 shadow-md'>
                    <ul className='flex justify-center'>
                        <li>
                            <Link to='/' className='hover:underline'>
                                Login
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}

            <Outlet />
        </div>
    );
}

export default App;
