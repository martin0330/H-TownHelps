import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../components/authContext';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { login } = useAuth();
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const navigate = useNavigate();

    const SignIn = async (data) => {
        const { email } = data;
        try {
            const response = await fetch('http://localhost:5000/api/signin', {
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

            setError(false);
            login({ userEmail: email });
            navigate("/main");
        } catch (err) {
            console.error(err);
            setError(true);
            setErrorText('An error occurred. Please try again.');
        }
    }

    const onSubmit = (data) => {
        SignIn(data);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign In</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email Address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="johndoe@example.com"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                                     focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    {...register('email', { required: true })}
                                />
                                {errors.email && (
                                    <p className='text-red-500 text-xs italic'>
                                        Email is required
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none
                                     focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    {...register('password', { required: true })}
                                />
                                {errors.password && (
                                    <p className='text-red-500 text-xs italic'>
                                        Password is required
                                    </p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{errorText}</span>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600
                                 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign In
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/registration" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up here!
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
