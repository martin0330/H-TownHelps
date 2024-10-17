import { Outlet, Link, useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();

    // Check if the current route is the login or registration page
    const isLoginPage = location.pathname === '/';
    const isRegistrationPage = location.pathname === '/registration';

    return (
        <>
            {/* Conditionally render the nav bar based on the current path */}
            {!isLoginPage && !isRegistrationPage && (
                <nav>
                    <ul>
                        <li>
                            <Link to='/userprofile'>User Profile Page</Link>
                        </li>
                        <li>
                            <Link to='/events'>Events Page</Link>
                        </li>
                        <li>
                            <Link to='/volunteermatch'>
                                Volunteer Matching Page
                            </Link>
                        </li>
                        <li>
                            <Link to='/notifications'>Notifications Page</Link>
                        </li>
                        <li>
                            <Link to='/volunteerhist'>
                                Volunteer History Page
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}

            {/* Show only the Login link on the registration page */}
            {isRegistrationPage && (
                <nav>
                    <ul>
                        <li>
                            <Link to='/'>Login</Link>
                        </li>
                    </ul>
                </nav>
            )}

            <Outlet />
        </>
    );
}

export default App;
