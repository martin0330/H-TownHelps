import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from "react-router-dom";

const Registration = () => {
    const { register, handleSubmit } = useForm();
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [signedUp, setSignedUp] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data);
        setSubmitted(true);

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(true);
                setErrorText(
                    errorData.error || 'Something went wrong. Please try again.'
                );
                return;
            }

            const result = await response.json();
            console.log(result);
            setSignedUp(true);
            setError(false);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(true);
            setErrorText('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register to Volunteer!
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                id="first"
                                name="first"
                                type="text"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                {...register('firstName')}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                id="last"
                                name="last"
                                type="text"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                {...register('lastName')}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                {...register('email')}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                {...register('password')}
                                pattern="^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])\S{8,}$"
                                title="Password must contain at least one number, one alphabet, one symbol, and be at least 8 characters long"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="repassword" className="block text-sm font-medium text-gray-700">
                                Re-type Password
                            </label>
                            <input
                                id="repassword"
                                name="repassword"
                                type="password"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                {...register('repassword')}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className="block w-full mt-1 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                {...register('gender')}
                                required
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Submit
                            </button>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>

                    {submitted && signedUp && (
                        <div className="mt-4 text-green-500 font-medium text-center">
                            Registration successful!
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-4 border border-red-500 bg-red-100 text-red-700 rounded">
                            <strong>Error:</strong> {errorText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Registration;
