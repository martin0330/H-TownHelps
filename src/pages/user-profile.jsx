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
    const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm({criteriaMode: "all"});
    const [selectedDates, setSelectedDates] = useState([]);
    const { user, setUserProfile } = useAuth();
    const navigate = useNavigate();
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
                    console.log(result);
                    Object.keys(result).forEach(key => {
                        if (key === 'state') {
                            setValue(key, states.find(state => state.value === result[key]));
                        } else if (key === 'skills') {
                            setValue(key, result[key].map(skill => ({ value: skill, label: skill })));
                        } else if (key === 'availability') {
                            setSelectedDates(result[key].map(dateStr => new Date(dateStr)));
                        } else {
                            setValue(key, result[key]);
                        }
                    });
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to fetch profile data');
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while autofilling. Please try again.');
            }
        };
    
        fetchData();
    }, [user, setValue]);

    const onSubmit = async(data) => {
        if (!user || !user.userEmail) {
            setError("User not authenticated. Please log in.");
            return;
        }

        data.skills = watch('skills').map(skill => skill.value);
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
            setUserProfile(data);
            await triggerMatching(user.userEmail);
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred. Please try again.');
        }
    };

    const triggerMatching = async (email) => {
        try {
            const response = await fetch('http://localhost:5000/api/trigger-matching', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to trigger matching process');
            }

            const result = await response.json();
            setSuccessMessage(result.message);
            navigate('/main-page');
        } catch (error) {
            console.error('Error triggering matching:', error);
            setError('Failed to start matching process. Please try again.');
        }
    };

    const handleDateChange = (date) => {
        if (date) {
            setSelectedDates(prev => [...prev, date]);
        }
    };

    const handleDateRemove = (dateToRemove) => {
        setSelectedDates(prev => prev.filter(date => date.getTime() !== dateToRemove.getTime()));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl bg-white p-8 rounded shadow-md">
                {/* Form fields remain the same */}
                {/* ... */}

                {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-xs italic mt-4">{successMessage}</p>}

                <button
                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
