import React from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12'>
            <h1 className='text-4xl font-bold text-gray-800 mb-6'>
                Welcome to H-TownHelps!
            </h1>
            <p className='text-lg text-gray-600 mb-10 text-center px-6'>
                Manage your events, match with volunteer opportunities, and
                more.
            </p>

            <div className='main-page-links'>
                <ul className='space-y-4'>
                    <li>
                        <Link
                            to='/events'
                            className='block w-full px-8 py-3 text-center bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300'
                        >
                            View Events
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/volunteer-match'
                            className='block w-full px-8 py-3 text-center bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-300'
                        >
                            Volunteer Matching
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/notifications'
                            className='block w-full px-8 py-3 text-center bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700 transition duration-300'
                        >
                            View Notifications
                        </Link>
                    </li>
                    <li>
                        <Link
                            to='/volunteerhist'
                            className='block w-full px-8 py-3 text-center bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition duration-300'
                        >
                            Volunteer History
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default MainPage;
