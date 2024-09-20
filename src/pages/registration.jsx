
import React from 'react';
import { useForm } from 'react-hook-form';
const Registration = () => {
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
            <div class="main">
        <h2>Register to Volunteer!</h2>
        <form action="">
            <label for="first" className='block text-gray-700 font-medium mb-2'>First Name:</label>
            <input
                className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500' 
                type="text" 
                id="first" 
                name="first" 
                required />

            <label for="last" className='block text-gray-700 font-medium mb-2'>Last Name:</label>
            <input
            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500' 
            type="text" 
            id="last" 
            name="last" 
            required />

            <label for="email" className='block text-gray-700 font-medium mb-2'>Email:</label>
            <input
            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500' 
            type="email" 
            id="email" 
            name="email" 
            required />

            <label for="password" className='block text-gray-700 font-medium mb-2'>Password:</label>
            <input
            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500' 
            type="password" 
            id="password" 
            name="password"                   
            pattern="^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])\S{8,}$"                    
            title="Password must contain at least one number, 
                           one alphabet, one symbol, and be at 
                           least 8 characters long" 
            required />

            <label for="repassword" className='block text-gray-700 font-medium mb-2'>Re-type Password:</label>
            <input
            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500' 
            type="password"
            id="repassword" 
            name="repassword" 
            required />

            <label for="gender" className='block text-gray-700 font-medium mb-2'>Gender:</label>
            <select id="gender" name="gender" required>
                <option value="male">
                    Male
                </option>
                <option value="female">
                    Female
                </option>
                <option value="other">
                    Other
                </option>
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
    </div>
    </center>
            
        </form>

    );
};

export default Registration;