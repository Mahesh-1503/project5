const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other', 'prefer-not-to-say'],
        default: 'prefer-not-to-say'
    },
    address: {
        street: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        zipCode: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true,
            default: 'United States'
        }
    },
    interests: [{
        type: String,
        trim: true
    }],
    newsletter: {
        type: Boolean,
        default: false
    },
    termsAccepted: {
        type: Boolean,
        required: [true, 'You must accept the terms and conditions']
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ registrationDate: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Method to get user data for Excel export
userSchema.methods.toExcelData = function () {
    return {
        'First Name': this.firstName,
        'Last Name': this.lastName,
        'Email': this.email,
        'Phone': this.phone || '',
        'Date of Birth': this.dateOfBirth.toLocaleDateString(),
        'Gender': this.gender,
        'Street': this.address.street || '',
        'City': this.address.city || '',
        'State': this.address.state || '',
        'Zip Code': this.address.zipCode || '',
        'Country': this.address.country,
        'Interests': this.interests.join(', ') || '',
        'Newsletter': this.newsletter ? 'Yes' : 'No',
        'Registration Date': this.registrationDate.toLocaleDateString(),
        'Last Updated': this.lastUpdated.toLocaleDateString()
    };
};

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema); 