import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [selectedDates, setSelectedDates] = useState([]);
    const { user, setUserProfile } = useAuth();
    const navigate = useNavigate();
    console.log(user);

    useEffect(() => {
        const fetchData = async () => {
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
                    console.log(result);
                    setValue('fullName', result.fullName);
                    setValue('address1', result.address1);
                    setValue('address2', result.address2);
                    setValue('city', result.city);
                    setValue('zipCode', result.zipCode);
                    
                    // Set state value
                    const stateValue = states.find(state => state.value === result.state);
                    setValue('state', stateValue); // Autofill state
    
                    // Set skills value
                    const skillsValues = result.skills.map(skill => ({
                        value: skill,
                        label: skill
                    }));
                    setValue('skills', skillsValues); // Autofill skills
                    
                    // Set selected dates
                    const availabilityDates = result.availability.map(dateStr => new Date(dateStr));
                    setSelectedDates(availabilityDates);
                } else {
                    const errorData = await response.json();
                    console.log(errorData.error);
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while autofilling. Please try again.');
                setSuccessMessage(null); // Clear success message
            }
        };
    
        fetchData();
    }, [user.userEmail]);
    

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const onSubmit = async(data) => {
        data.skills = watch('skills');
        data.availability = selectedDates;
        data.email = user.userEmail;

        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Check for the response status
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.error);
                setError(errorData.error || 'Something went wrong. Please try again.');
                setSuccessMessage(null); // Clear success message
                return;
            }

            const result = await response.json();
            console.log(result);
            setSuccessMessage(result.message); // Set success message
            setError(null); // Clear error message

            setUserProfile(data);

            navigate('/volunteer-matching')
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
            setSuccessMessage(null); // Clear success message
        }
    };

    const handleDateChange = (date) => {
        if (date) {
            setSelectedDates([...selectedDates, date]);
        }
    };

    const handleDateRemove = (dateToRemove) => {
        setSelectedDates(selectedDates.filter(date => date.getTime() !== dateToRemove.getTime()));
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl bg-white p-8 rounded shadow-md">

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
                <label className="block text-gray-700 font-medium mb-2" id="state-select">
                    State
                </label>
                <Select
                    aria-labelledby="state-select"
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
                <label className="block text-gray-700 font-medium mb-2" id="skills-label">
                    Skills
                </label>
                <Select
                    name="skills"
                    options={skillsOptions}
                    isMulti
                    className="w-full"
                    aria-labelledby="skills-label"
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
                <label className="block text-gray-700 font-medium mb-2" htmlFor="availability">
                    Availability
                </label>
                <DatePicker
                    id="availability" // Ensure the label is linked to the input
                    selected={null}
                    onChange={handleDateChange}
                    selectsStart
                    startDate={null}
                    endDate={null}
                    inline
                    role="combobox" // Add accessible role
                    aria-labelledby="availability-label" // Ensure the correct label association
                    className="w-full border border-gray-400 rounded py-2 px-3 text-gray-700"
                    placeholderText="Select dates"
                />
                <div className="mt-2">
                    {selectedDates.map((date, index) => (
                        <div key={index} className="flex items-center mb-1">
                            <span className="text-gray-700">{date.toDateString()}</span>
                            <button
                                type="button"
                                onClick={() => handleDateRemove(date)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                {errors.availability && <p className="text-red-500 text-xs italic">{errors.availability.message}</p>}
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

