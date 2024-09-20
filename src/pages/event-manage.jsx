import React from 'react';
import { useForm } from 'react-hook-form';
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
    { value: 'For Profit & Nonprofit Development', label: 'For Profit & Nonprofit Development' },
    { value: 'HR', label: 'HR' },
    { value: 'Healthcare & Social Services', label: 'Healthcare & Social Services' },
    { value: 'Hobbies & Crafts', label: 'Hobbies & Crafts' },
    { value: 'Housing & Facilities', label: 'Housing & Facilities' },
    { value: 'IT Infrastructure & Software', label: 'IT Infrastructure & Software' },
    { value: 'Interactive & Web Development', label: 'Interactive & Web Development' },
    { value: 'Interpersonal', label: 'Interpersonal' },
    { value: 'Language & Culture', label: 'Language & Culture' },
    { value: 'Legal & Advocacy', label: 'Legal & Advocacy' },
    { value: 'Logistics, Supply Chain & Transportation', label: 'Logistics, Supply Chain & Transportation' },
    { value: 'Marketing & Communications', label: 'Marketing & Communications' },
    { value: 'Music', label: 'Music' },
    { value: 'Performing Arts', label: 'Performing Arts' },
    { value: 'Sports & Recreation', label: 'Sports & Recreation' },
    { value: 'Strategy Development & Business Planning', label: 'Strategy Development & Business Planning' },
    { value: 'Trades', label: 'Trades' }
];

const urgencyOptions = [
    { value: 'Urgent', label: 'Urgent'},
    { value: 'High', label: 'High'},
    { value: 'Medium', label: 'Medium'},
    { value: 'Low', label: 'Low'}
]

const EventManage = () => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();
    const [selectedDates, setSelectedDates] = React.useState([]);

    const onSubmit = (data) => {
        data.skills = watch('skills');
        data.availability = selectedDates;
        console.log(data);
    };

    const handleDateChange = (date) => {
        setSelectedDates([...selectedDates, date]);
    };

    const handleDateRemove = (dateToRemove) => {
        setSelectedDates(
            selectedDates.filter(
                (date) => date.getTime() !== dateToRemove.getTime()
            )
        );
    };

    return (
        <div className=' w-full h-full flex flex-col items-center justify-center'>
            <div className=' text-4xl pb-10 font-bold'> Event Management </div>
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
                            htmlFor='email'
                        >
                            Event Description
                        </label>
                        <textarea
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            id='eventDesc'
                            rows={4}
                            cols={50}
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
                            htmlFor='email'
                        >
                            Location
                        </label>
                        <textarea
                            className='appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500'
                            id='location'
                            rows={2}
                            cols={50}
                            {...register('location', { required: true })}
                        />
                        {errors.location && (
                            <p className='text-red-500 text-xs italic'>
                                Location is required.
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Skills
                        </label>
                        <Select
                            name="skills"
                            options={skillsOptions}
                            isMulti
                            className="w-full"
                            onChange={(options) => setValue('skills', options.map(option => option.value))}
                        />
                        {errors.skills && <p className="text-red-500 text-xs italic">This field is required</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Urgency
                        </label>
                        <Select
                            name="urgency"
                            options={urgencyOptions}
                            className="w-full"
                            onChange={(option) => setValue('urgency', option.value)}
                        />
                        {errors.urgency && <p className="text-red-500 text-xs italic">This field is required</p>}
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 font-medium mb-2'>
                            Event Date
                        </label>
                        <DatePicker
                            selected={null}
                            onChange={handleDateChange}
                            selectsStart
                            startDate={null}
                            endDate={null}
                            inline
                            className='w-full border border-gray-400 rounded py-2 px-3 text-gray-700'
                        />
                        <div className='mt-2'>
                            {selectedDates.map((date, index) => (
                                <div
                                    key={index}
                                    className='flex items-center mb-1'
                                >
                                    <span className='text-gray-700'>
                                        {date.toDateString()}
                                    </span>
                                    <button
                                        type='button'
                                        onClick={() => handleDateRemove(date)}
                                        className='ml-2 text-red-500 hover:text-red-700'
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        {errors.availability && (
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
            </div>
        </div>
    );
};

export default EventManage;
