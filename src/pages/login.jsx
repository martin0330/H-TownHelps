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

            const result = await response.json();
            console.log(result);
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
        console.log(data);
        SignIn(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <center>
                <div className='mb-4'>
                    <label
                        className='block text-gray-700 font-medium mb-2'
                        htmlFor='email'
                    >
                        Email: 
                    </label>
                    <input
                        className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                        id='email'
                        type='email'
                        placeholder='johndoe@example.com'
                        {...register('email', { required: true })}
                    />
                    {errors.email && (
                        <p className='text-red-500 text-xs italic'>
                            Email is required
                        </p>
                    )}
                </div>
                <div>
                    <label 
                        htmlFor="password" 
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Password: 
                    </label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="••••••••" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        {...register('password', { required: true })}
                    />
                    {errors.password && (
                        <p className='text-red-500 text-xs italic'>
                            Password is required
                        </p>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{errorText}</span>
                    </div>
                )}

                <button
                    className='bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                    type='submit'
                >
                    Submit
                </button>
                <div>
                    <label>Don't have an account yet?</label>                
                </div>
                <div className="mb-4 text-blue-500 font-medium">
                    <li>
                        <Link to="/registration">Sign up here!</Link>
                    </li>
                </div>
            </center>
        </form>
    );
};

export default Login;
