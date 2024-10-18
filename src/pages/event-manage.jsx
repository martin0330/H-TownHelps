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
    { value: 'Healthcare & Social Services', label: 'Healthcare & Social Services' },
    { value: 'Housing & Facilities', label: 'Housing & Facilities' },
    { value: 'IT Infrastructure & Software', label: 'IT Infrastructure & Software' },
    { value: 'Marketing & Communications', label: 'Marketing & Communications' },
    { value: 'Music', label: 'Music' },
    { value: 'Performing Arts', label: 'Performing Arts' },
    { value: 'Sports & Recreation', label: 'Sports & Recreation' },
    { value: 'Strategy Development & Business Planning', label: 'Strategy Development & Business Planning' },
    { value: 'Trades', label: 'Trades' },
];

const EventManage = () => {
    const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);

    const watchDate = watch('date');

    useEffect(() => {
        if (watchDate) {
            fetchAvailableUsers(watchDate);
        }
    }, [watchDate]);

    const fetchAvailableUsers = async (date) => {
        try {
            const response = await fetch(`http://localhost:5000/api/availableUsers?date=${date.toISOString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch available users');
            }
            const users = await response.json();
            setAvailableUsers(users.map(user => ({ value: user._id, label: user.fullName })));
        } catch (error) {
            console.error('Failed to fetch available users:', error);
            setSubmitError('Failed to fetch available users.');
        }
    };
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            data.skills = watch('skills');
            data.date = selectedDate;

            const response = await fetch('http://localhost:5000/api/addEvent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred.');
            }

            const result = await response.json();
            setSubmitSuccess('Event added successfully!');
            setSubmitError('');
            navigate("/events");
        } catch (error) {
            setSubmitError('Failed to submit event.');
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Event Management</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Event Name</label>
                        <input
                            className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-indigo-500"
                            id="name"
                            type="text"
                            {...register('name', { required: true, maxLength: 100 })}
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">Name is required</p>}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="eventDesc">Event Description</label>
                        <textarea
                            className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-indigo-500"
                            id="eventDesc"
                            rows={4}
                            {...register('description', { required: 'Description is required' })}
                        />
                        {errors.description && <p className='text-red-500 text-xs italic'>{errors.description.message}</p>}
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 font-bold mb-2' htmlFor='location'>
                            Location
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='location'
                            type='text'
                            {...register('location', { required: 'Location is required' })}
                        />
                        {errors.location && <p className='text-red-500 text-xs italic'>{errors.location.message}</p>}
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 font-bold mb-2'>
                            Event Date
                        </label>
                        <Controller
                            name='date'
                            control={control}
                            rules={{ required: 'Event date is required' }}
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    placeholderText='Select event date'
                                />
                            )}
                        />
                        {errors.date && <p className='text-red-500 text-xs italic'>{errors.date.message}</p>}
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 font-bold mb-2'>
                            Available Users
                        </label>
                        <Controller
                            name='selectedUsers'
                            control={control}
                            rules={{ required: 'At least one user must be selected' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={availableUsers}
                                    isMulti
                                    className='basic-multi-select'
                                    classNamePrefix='select'
                                />
                            )}
                        />
                        {errors.selectedUsers && <p className='text-red-500 text-xs italic'>{errors.selectedUsers.message}</p>}
                    </div>

                    <div className='mb-4'>
                        <label className='block text-gray-700 font-bold mb-2' htmlFor='imageUrl'>
                            Image URL (optional)
                        </label>
                        <input
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='imageUrl'
                            type='text'
                            {...register('imageUrl')}
                        />
                    </div>

                    <div className='flex items-center justify-between'>
                        <button
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                            type='submit'
                        >
                            Create Event
                        </button>
                    </div>
                </form>

                {submitError && <p className='text-red-500 text-xs italic mt-4'>{submitError}</p>}
                {submitSuccess && <p className='text-green-500 text-xs italic mt-4'>{submitSuccess}</p>}
            </div>
        </div>
    );
};

export default EventManage;

