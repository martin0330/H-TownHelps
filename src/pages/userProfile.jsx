import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../components/authContext';

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

const UserProfile = () => {
    const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm({criteriaMode: "all"});
    const [selectedDates, setSelectedDates] = useState([]);
    const { user } = useAuth();
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.userEmail) {
                setError("User not authenticated. Please log in.");
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/autofillProfile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: user.userEmail }),
                });

                if (response.ok) {
                    const result = await response.json();
                    setValue('fullName', result.fullName);
                    setValue('address1', result.address1);
                    setValue('address2', result.address2);
                    setValue('city', result.city);
                    setValue('zipCode', result.zipCode);
                    
                    const stateValue = states.find(state => state.value === result.state);
                    setValue('state', stateValue); 

                    const skillsValues = result.skills.map(skill => ({
                        value: skill,
                        label: skill
                    }));
                    setValue('skills', skillsValues);
                    
                    const availabilityDates = result.availability.map(dateStr => new Date(dateStr));
                    setSelectedDates(availabilityDates);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [user.userEmail]);

    const onSubmit = async (data) => {
        data.skills = watch('skills');
        data.skills = data.skills.map( entry => entry.value ); // save only the value of the entry
        data.state = data.state.value; // save only the value of the entry
        data.availability = selectedDates;
        data.email = user.userEmail;

        if (selectedDates.length === 0) {
            setError("Availability is required");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong. Please try again.');
            }

            const result = await response.json();
            setSuccessMessage(result.message);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred. Please try again.');
        }
    };

    const handleDateChange = (date) => {
        if (date && !selectedDates.some(selectedDate => selectedDate.getTime() === date.getTime())) {
            const updatedDates = [...selectedDates, date].sort((a, b) => a - b);
            setSelectedDates(updatedDates);
        }
    };

    const handleDateRemove = (dateToRemove) => {
        setSelectedDates(prev => prev.filter(date => date.getTime() !== dateToRemove.getTime()));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="fullName">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        {...register('fullName', { required: true })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.fullName && <p className="text-red-500 mt-1">This field is required</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="address1">
                        Address 1
                    </label>
                    <input
                        type="text"
                        id="address1"
                        {...register('address1', { required: true })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                            errors.address1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.address1 && <p className="text-red-500 mt-1">This field is required</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="address2">
                        Address 2
                    </label>
                    <input
                        type="text"
                        id="address2"
                        {...register('address2')}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 border-gray-300"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="state">State</label>
                        <Controller
                            name="state"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={states}
                                    {...field}
                                    onChange={option => field.onChange(option)}
                                    defaultValue={field.value}
                                />
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="city">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            {...register('city', { required: true })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                                errors.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.city && <p className="text-red-500 mt-1">This field is required</p>}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="zipCode">
                        Zip Code
                    </label>
                    <input
                        type="text"
                        id="zipCode"
                        {...register('zipCode', { required: true })}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                            errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.zipCode && <p className="text-red-500 mt-1">This field is required</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="skills">Skills</label>
                    <Controller
                        name="skills"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={skillsOptions}
                                isMulti
                                {...field}
                                onChange={option => field.onChange(option)}
                                defaultValue={field.value}
                            />
                        )}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="availability">
                        Availability
                    </label>
                    <DatePicker
                        selected={null}
                        onChange={handleDateChange}
                        highlightDates={selectedDates} // Highlight selected dates
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full"
                        placeholderText="Select available dates"
                        inline // Display the calendar inline
                    />
                    <ul className="mt-2">
                        {selectedDates.map((date, index) => (
                            <li key={index} className="flex items-center justify-between mb-1">
                                {date.toLocaleDateString()}
                                <button
                                    type="button"
                                    onClick={() => handleDateRemove(date)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        Save Profile
                    </button>
                </div>

                {error && <p className="text-red-500 mt-4">{error}</p>}
                {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            </form>
        </div>
    );
};

export default UserProfile;
