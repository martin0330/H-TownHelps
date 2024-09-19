import React from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const states = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
];

const skillsOptions = [
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Python', label: 'Python' }
];

const UserProfile = () => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [selectedDates, setSelectedDates] = React.useState([]);

    const onSubmit = (data) => {
        data.skills = watch('skills');
        data.availability = selectedDates;
        console.log(data);
    };

    const handleDateChange = (date) => {
        setSelectedDates([...selectedDates, date]);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white shadow-md rounded-lg">

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="fullName">
                    Full Name
                </label>
                <input
                    className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    {...register('fullName', { required: true, maxLength: 50 })}
                />
                {errors.fullName && <p className="text-red-500 text-xs italic">This field is required (max 50 characters)</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="address1">
                    Address 1
                </label>
                <input
                    className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                    id="address1"
                    type="text"
                    placeholder="123 Main St"
                    {...register('address1', { required: true, maxLength: 100 })}
                />
                {errors.address1 && <p className="text-red-500 text-xs italic">This field is required</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="address2">
                    Address 2
                </label>
                <input
                    className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                    id="address2"
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    {...register('address2', { maxLength: 100 })}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="city">
                    City
                </label>
                <input
                    className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                    id="city"
                    type="text"
                    placeholder="City"
                    {...register('city', { required: true, maxLength: 100 })}
                />
                {errors.city && <p className="text-red-500 text-xs italic">This field is required</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                    State
                </label>
                <Select
                    name="state"
                    options={states}
                    className="w-full"
                    onChange={(option) => setValue('state', option.value)}
                />
                {errors.state && <p className="text-red-500 text-xs italic">This field is required</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="zipCode">
                    Zip Code
                </label>
                <input
                    className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                    id="zipCode"
                    type="text"
                    placeholder="12345"
                    {...register('zipCode', { required: true, minLength: 5, maxLength: 9 })}
                />
                {errors.zipCode && <p className="text-red-500 text-xs italic">This field is required (5-9 characters)</p>}
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
                <label className="block text-gray-700 font-medium mb-2" htmlFor="preferences">
                    Preferences
                </label>
                <textarea
                    className="appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-500"
                    id="preferences"
                    placeholder="Enter your preferences"
                    {...register('preferences')}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                    Availability
                </label>
                <DatePicker
                    selected={null}
                    onChange={handleDateChange}
                    selectsMultiple
                    inline
                    className="w-full"
                />
                {errors.availability && <p className="text-red-500 text-xs italic">This field is required</p>}
            </div>

            <button
    className="!bg-indigo-500 hover:!bg-indigo-700 !text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    type="submit"
>
    Submit
</button>

        </form>
        </div>
    );
};

export default UserProfile;

