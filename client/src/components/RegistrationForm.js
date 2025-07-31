import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
    User,
    Mail,
    Lock,
    Phone,
    Calendar,
    MapPin,
    Heart,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const RegistrationForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm();

    const interests = [
        'Technology', 'Sports', 'Music', 'Travel', 'Cooking',
        'Reading', 'Gaming', 'Fitness', 'Art', 'Photography',
        'Science', 'Business', 'Education', 'Health', 'Fashion'
    ];

    const handleInterestChange = (interest) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            // Prepare form data
            const formData = {
                ...data,
                interests: selectedInterests,
                dateOfBirth: data.dateOfBirth,
                address: {
                    street: data.street,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                    country: data.country || 'United States'
                }
            };

            // Submit to backend
            const response = await axios.post('/api/registration', formData);

            if (response.data.success) {
                toast.success('Registration successful! Data saved to database and Excel file.');
                reset();
                setSelectedInterests([]);
            }
        } catch (error) {
            console.error('Registration error:', error);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => toast.error(err));
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1>User Registration</h1>
                <p>Complete the form below to register. Your data will be saved to both database and Excel file.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid">
                    {/* Personal Information */}
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.2rem' }}>
                            Personal Information
                        </h3>

                        <div className="form-group">
                            <label htmlFor="firstName">
                                <User size={16} style={{ marginRight: '8px' }} />
                                First Name *
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                {...register('firstName', {
                                    required: 'First name is required',
                                    minLength: { value: 2, message: 'First name must be at least 2 characters' }
                                })}
                                className={errors.firstName ? 'error' : ''}
                                placeholder="Enter your first name"
                            />
                            {errors.firstName && (
                                <div className="error-message">
                                    <AlertCircle size={14} />
                                    {errors.firstName.message}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">
                                <User size={16} style={{ marginRight: '8px' }} />
                                Last Name *
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                {...register('lastName', {
                                    required: 'Last name is required',
                                    minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                                })}
                                className={errors.lastName ? 'error' : ''}
                                placeholder="Enter your last name"
                            />
                            {errors.lastName && (
                                <div className="error-message">
                                    <AlertCircle size={14} />
                                    {errors.lastName.message}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail size={16} style={{ marginRight: '8px' }} />
                                Email Address *
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Please enter a valid email address'
                                    }
                                })}
                                className={errors.email ? 'error' : ''}
                                placeholder="Enter your email address"
                            />
                            {errors.email && (
                                <div className="error-message">
                                    <AlertCircle size={14} />
                                    {errors.email.message}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <Lock size={16} style={{ marginRight: '8px' }} />
                                Password *
                            </label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                className={errors.password ? 'error' : ''}
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <div className="error-message">
                                    <AlertCircle size={14} />
                                    {errors.password.message}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">
                                <Phone size={16} style={{ marginRight: '8px' }} />
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                {...register('phone', {
                                    pattern: {
                                        value: /^[\+]?[1-9][\d]{0,15}$/,
                                        message: 'Please enter a valid phone number'
                                    }
                                })}
                                className={errors.phone ? 'error' : ''}
                                placeholder="Enter your phone number"
                            />
                            {errors.phone && (
                                <div className="error-message">
                                    <AlertCircle size={14} />
                                    {errors.phone.message}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateOfBirth">
                                <Calendar size={16} style={{ marginRight: '8px' }} />
                                Date of Birth *
                            </label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                {...register('dateOfBirth', {
                                    required: 'Date of birth is required'
                                })}
                                className={errors.dateOfBirth ? 'error' : ''}
                            />
                            {errors.dateOfBirth && (
                                <div className="error-message">
                                    <AlertCircle size={14} />
                                    {errors.dateOfBirth.message}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">
                                Gender
                            </label>
                            <select
                                id="gender"
                                {...register('gender')}
                                defaultValue="prefer-not-to-say"
                            >
                                <option value="prefer-not-to-say">Prefer not to say</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: '#333', fontSize: '1.2rem' }}>
                            Address Information
                        </h3>

                        <div className="form-group">
                            <label htmlFor="street">
                                <MapPin size={16} style={{ marginRight: '8px' }} />
                                Street Address
                            </label>
                            <input
                                id="street"
                                type="text"
                                {...register('street')}
                                placeholder="Enter your street address"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">
                                <MapPin size={16} style={{ marginRight: '8px' }} />
                                City
                            </label>
                            <input
                                id="city"
                                type="text"
                                {...register('city')}
                                placeholder="Enter your city"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">
                                <MapPin size={16} style={{ marginRight: '8px' }} />
                                State/Province
                            </label>
                            <input
                                id="state"
                                type="text"
                                {...register('state')}
                                placeholder="Enter your state or province"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="zipCode">
                                <MapPin size={16} style={{ marginRight: '8px' }} />
                                ZIP/Postal Code
                            </label>
                            <input
                                id="zipCode"
                                type="text"
                                {...register('zipCode')}
                                placeholder="Enter your ZIP or postal code"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country">
                                <MapPin size={16} style={{ marginRight: '8px' }} />
                                Country
                            </label>
                            <input
                                id="country"
                                type="text"
                                {...register('country')}
                                defaultValue="United States"
                                placeholder="Enter your country"
                            />
                        </div>

                        {/* Interests */}
                        <div className="form-group">
                            <label>
                                <Heart size={16} style={{ marginRight: '8px' }} />
                                Interests (Select multiple)
                            </label>
                            <div className="interests-grid">
                                {interests.map((interest) => (
                                    <div
                                        key={interest}
                                        className="interest-checkbox"
                                        onClick={() => handleInterestChange(interest)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedInterests.includes(interest)}
                                            onChange={() => handleInterestChange(interest)}
                                        />
                                        <span>{interest}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Subscription */}
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="newsletter"
                                {...register('newsletter')}
                            />
                            <label htmlFor="newsletter">
                                Subscribe to our newsletter for updates and offers
                            </label>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="termsAccepted"
                                {...register('termsAccepted', {
                                    required: 'You must accept the terms and conditions'
                                })}
                            />
                            <label htmlFor="termsAccepted">
                                I agree to the terms and conditions *
                            </label>
                        </div>
                        {errors.termsAccepted && (
                            <div className="error-message">
                                <AlertCircle size={14} />
                                {errors.termsAccepted.message}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner"></span>
                            Registering...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={16} style={{ marginRight: '8px' }} />
                            Register Now
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm; 