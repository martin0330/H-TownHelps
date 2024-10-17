import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center">
                <h1 className="text-6xl font-bold animate-bounce">404</h1>
                <p className="mt-4 text-xl">Page Not Found</p>
                <p className="mt-2 text-gray-400">Sorry, the page you're looking for doesn't exist.</p>
                <a 
                    href="/" 
                    className="mt-6 inline-block px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                    Go Home
                </a>
            </div>
        </div>
    );
}

export default NotFound;
