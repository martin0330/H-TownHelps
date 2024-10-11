import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const Registration = () => {
    const { register, handleSubmit } = useForm();
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [signedUp, setSignedUp] = useState(false);

    const onSubmit = async (data) => {
        console.log(data);
        setSubmitted(true);

        try {
            // Send a POST request to your backend API
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Check for the response status
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
            // You might want to redirect or show a success message here
        } catch (err) {
            console.error(err);
            setError(true);
            setErrorText('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <center>
                <div className='main'>
                    <h2>Register to Volunteer!</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label
                            htmlFor='firstName'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            First Name:
                        </label>
                        <input
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            type='text'
                            id='first'
                            name='first'
                            {...register('firstName')}
                            required
                        />

                        <label
                            htmlFor='lastName'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            Last Name:
                        </label>
                        <input
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            type='text'
                            id='last'
                            name='last'
                            {...register('lastName')}
                            required
                        />

                        <label
                            htmlFor='email'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            Email:
                        </label>
                        <input
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            type='email'
                            id='email'
                            name='email'
                            {...register('email')}
                            required
                        />

                        <label
                            htmlFor='password'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            Password:
                        </label>
                        <input
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            type='password'
                            id='password'
                            name='password'
                            {...register('password')}
                            pattern='^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])\S{8,}$'
                            title='Password must contain at least one number, one alphabet, one symbol, and be at least 8 characters long'
                            required
                        />

                        <label
                            htmlFor='repassword'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            Re-type Password:
                        </label>
                        <input
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            type='password'
                            id='repassword'
                            name='repassword'
                            {...register('repassword')}
                            required
                        />

                        <label
                            htmlFor='gender'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            Gender:
                        </label>
                        <select
                            id='gender'
                            name='gender'
                            {...register('gender')}
                            required
                        >
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                            <option value='other'>Other</option>
                        </select>

                        <div>
                            <button
                                className='bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                                type='submit'
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                    {submitted && signedUp && (
                        <div className='text-4xl text-green-400 text-bold'>
                            Registration successful!
                        </div>
                    )}
                    {error && (
                        <div className='mt-4 p-4 border border-red-500 bg-red-100 text-red-700 rounded'>
                            <strong>Error:</strong> {errorText}
                        </div>
                    )}
                </div>
            </center>
        </div>
    );
};

export default Registration;
