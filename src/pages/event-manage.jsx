import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const skillsOptions = [
    { value: 'Academics', label: 'Academics' },
    { value: 'Administrative & Clerical', label: 'Administrative & Clerical' },
    { value: 'Animals & Environment', label: 'Animals & Environment' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Business & Management', label: 'Business & Management' },
    { value: 'Children & Family', label: 'Children & Family' },
    { value: 'Computers & IT', label: 'Computers & IT' },
    { value: 'Disaster Relief', label: 'Disaster Relief' },
    { value: 'Education & Literacy', label: 'Education & Literacy' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Food Service & Events', label: 'Food Service & Events' },
    {
        value: 'For Profit & Nonprofit Development',
        label: 'For Profit & Nonprofit Development',
    },
    { value: 'HR', label: 'HR' },
    {
        value: 'Healthcare & Social Services',
        label: 'Healthcare & Social Services',
    },
    { value: 'Hobbies & Crafts', label: 'Hobbies & Crafts' },
    { value: 'Housing & Facilities', label: 'Housing & Facilities' },
    {
        value: 'IT Infrastructure & Software',
        label: 'IT Infrastructure & Software',
    },
    {
        value: 'Interactive & Web Development',
        label: 'Interactive & Web Development',
    },
    { value: 'Interpersonal', label: 'Interpersonal' },
    { value: 'Language & Culture', label: 'Language & Culture' },
    { value: 'Legal & Advocacy', label: 'Legal & Advocacy' },
    {
        value: 'Logistics, Supply Chain & Transportation',
        label: 'Logistics, Supply Chain & Transportation',
    },
    {
        value: 'Marketing & Communications',
        label: 'Marketing & Communications',
    },
    { value: 'Music', label: 'Music' },
    { value: 'Performing Arts', label: 'Performing Arts' },
    { value: 'Sports & Recreation', label: 'Sports & Recreation' },
    {
        value: 'Strategy Development & Business Planning',
        label: 'Strategy Development & Business Planning',
    },
    { value: 'Trades', label: 'Trades' },
];

const EventManage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();
    const [selectedDate, setSelectedDate] = React.useState(null); // Only one date
    const [submitError, setSubmitError] = React.useState(''); // Error state for submission
    const [submitSuccess, setSubmitSuccess] = React.useState(''); // Success state for submission

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            data.skills = watch('skills');
            data.date = selectedDate; // Save the single date

            // Send POST request to the backend
            const response = await fetch('http://localhost:5000/api/addEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setSubmitError(errorData.error || 'An error occurred.');
                return;
            }

            const result = await response.json();
            setSubmitSuccess('Event added successfully!');
            setSubmitError('');
            navigate("/events");
        } catch (error) {
            console.error('Failed to submit event:', error);
            setSubmitError('Failed to submit event.');
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date); // Set a single date
    };

    return (
        <div className='w-full h-full flex flex-col items-center justify-center'>
            <div className='text-4xl pb-10 font-bold'>Event Management</div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 font-medium mb-2'
                            htmlFor='name'
                        >
                            Event Name
                        </label>
                        <input
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            id='name'
                            type='text'
                            {...register('name', {
                                required: true,
                                maxLength: {
                                    value: 100,
                                    message: 'Name cannot exceed 50 characters',
                                },
                            })}
                        />
                        {errors.name && (
                            <p className='text-red-500 text-xs italic'>
                                Name is required
                            </p>
                        )}
                    </div>
                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 font-medium mb-2'
                            htmlFor='eventDesc'
                        >
                            Event Description
                        </label>
                        <textarea
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            id='eventDesc'
                            rows={4}
                            {...register('eventDesc', { required: true })}
                        />
                        {errors.eventDesc && (
                            <p className='text-red-500 text-xs italic'>
                                Description is required
                            </p>
                        )}
                    </div>
                    <div className='mb-4'>
                        <label
                            className='block text-gray-700 font-medium mb-2'
                            htmlFor='location'
                        >
                            Location
                        </label>
                        <textarea
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            id='location'
                            rows={2}
                            {...register('location', { required: true })}
                        />
                        {errors.location && (
                            <p className='text-red-500 text-xs italic'>
                                Location is required.
                            </p>
                        )}
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 font-medium mb-2'>
                            Skills
                        </label>
                        <Select
                            name='skills'
                            options={skillsOptions}
                            isMulti
                            className='w-full'
                            onChange={(options) =>
                                setValue(
                                    'skills',
                                    options.map((option) => option.value)
                                )
                            }
                        />
                        {errors.skills && (
                            <p className='text-red-500 text-xs italic'>
                                This field is required
                            </p>
                        )}
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 font-medium mb-2'>
                            Event Date
                        </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange} // Single date selection
                            className='w-full border border-gray-400 rounded py-2 px-3 text-gray-700'
                            placeholderText='Select event date'
                        />
                        {errors.date && (
                            <p className='text-red-500 text-xs italic'>
                                This field is required
                            </p>
                        )}
                    </div>
                    <button
                        className='bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        type='submit'
                    >
                        Submit
                    </button>
                </form>

                {/* Display success or error messages */}
                {submitError && (
                    <p className='text-red-500 text-xs italic mt-4'>
                        {submitError}
                    </p>
                )}
                {submitSuccess && (
                    <p className='text-green-500 text-xs italic mt-4'>
                        {submitSuccess}
                    </p>
                )}
            </div>
        </div>
    );
};

export default EventManage;
