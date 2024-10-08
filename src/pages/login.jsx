
import React from 'react';
import { useForm } from 'react-hook-form';
import { Outlet, Link } from "react-router-dom";
const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
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
                for="password" 
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password: 
            </label>
            <input 
                type="password" 
                name="password" 
                id="password" 
                placeholder="••••••••" 
                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                required="">
            </input>
            {errors.password && (
                    <p className='text-red-500 text-xs italic'>
                        Password is required
                    </p>
                )}
            </div>
            <button
                className='bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                type='submit'
            >
                Submit
            </button>
            <div>
                <label>Don't have an account yet?</label>                
            </div>
            <div className="mb-4 text-blue-500 font-medium"
            >
  <li>
            <Link to="/registration">Sign up here!</Link>
          </li>
</div>
            </center>
            
        </form>

    );
};

export default Login;