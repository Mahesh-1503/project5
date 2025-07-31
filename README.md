# MERN Stack Registration Form with Excel Export

A complete MERN (MongoDB, Express.js, React, Node.js) stack application that allows users to register and automatically saves their data to both MongoDB database and an Excel (.xlsx) file.

## 🚀 Features

- **Modern React Form**: Beautiful, responsive registration form with comprehensive validation
- **Dual Data Storage**: Saves registration data to both MongoDB and Excel file simultaneously
- **Real-time Statistics**: View registration statistics and data from both sources
- **Excel Export**: Automatic Excel file creation and data appending with proper formatting
- **Form Validation**: Client-side and server-side validation with error handling
- **Modern UI/UX**: Clean, modern interface with smooth animations and responsive design
- **Security**: Password hashing with bcryptjs
- **CORS Support**: Proper CORS configuration for cross-origin requests

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd project5
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory (copy from `env.example`):
```bash
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/registration_app

# Server Configuration
PORT=5000

# Excel file path
EXCEL_FILE_PATH=./data/registrations.xlsx
```

**Note**: If you're using MongoDB Atlas, replace the MONGODB_URI with your Atlas connection string.

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### Option 2: Run Both Together (Recommended)
```bash
npm run dev:full
```

This will start both the backend server and React frontend concurrently.

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🗄️ API Endpoints

### Registration
- `POST /api/registration` - Register a new user
- `GET /api/registration` - Get all registrations from MongoDB
- `GET /api/registration/:id` - Get specific user by ID

### Excel Data
- `GET /api/registration/excel` - Get all registrations from Excel file
- `GET /api/registration/stats` - Get registration statistics

### Health Check
- `GET /api/health` - Server health status

## 📊 Features in Detail

### Registration Form
The registration form includes the following fields:
- **Personal Information**: First Name, Last Name, Email, Password, Phone, Date of Birth, Gender
- **Address Information**: Street, City, State, ZIP Code, Country
- **Interests**: Multiple selection from predefined options
- **Preferences**: Newsletter subscription, Terms acceptance

### Data Storage
- **MongoDB**: All user data is stored in MongoDB with proper indexing
- **Excel File**: Data is automatically appended to `data/registrations.xlsx`
- **Password Security**: Passwords are hashed using bcryptjs with 12 salt rounds

### Excel Export Features
- **Automatic File Creation**: Excel file is created with headers if it doesn't exist
- **Styled Headers**: Bold headers with background color
- **Alternating Row Colors**: Better readability with alternating row styling
- **Proper Column Widths**: Optimized column widths for better viewing
- **Data Validation**: Ensures data integrity before writing to Excel

### Statistics Dashboard
- **Real-time Stats**: View registration counts from both MongoDB and Excel
- **File Information**: Excel file size, last modified date, total entries
- **Recent Registrations**: Display latest registrations in a table format
- **Refresh Capability**: Manual refresh button to update statistics

## 🎨 UI/UX Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern Styling**: Gradient backgrounds, smooth animations, and clean typography
- **Form Validation**: Real-time validation with helpful error messages
- **Loading States**: Spinner animations during form submission
- **Toast Notifications**: Success and error messages using react-hot-toast
- **Tab Navigation**: Easy switching between registration form and statistics
- **Icons**: Lucide React icons for better visual experience

## 🔧 Configuration Options

### MongoDB Connection
You can use either local MongoDB or MongoDB Atlas:

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/registration_app
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/registration_app
```

### Excel File Location
Customize where the Excel file is stored:
```env
EXCEL_FILE_PATH=./data/registrations.xlsx
```

### Server Port
Change the server port if needed:
```env
PORT=5000
```

## 📁 Project Structure

```
project5/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RegistrationForm.js
│   │   │   └── StatsSection.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── models/
│   └── User.js            # Mongoose User model
├── routes/
│   └── registration.js    # Registration API routes
├── utils/
│   └── excelHelper.js     # Excel file operations
├── data/                  # Excel file storage (auto-created)
├── server.js              # Express server
├── package.json
├── env.example
└── README.md
```

## 🛡️ Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **Input Validation**: Both client-side and server-side validation
- **CORS Protection**: Proper CORS configuration
- **Error Handling**: Comprehensive error handling and logging
- **Data Sanitization**: Input data is sanitized before storage

## 🧪 Testing the Application

1. **Start the application** using the instructions above
2. **Open http://localhost:3000** in your browser
3. **Fill out the registration form** with test data
4. **Submit the form** and check for success message
5. **Navigate to Statistics tab** to view the data
6. **Check the Excel file** at `data/registrations.xlsx`

## 🔍 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Ensure MongoDB is running
- Check your connection string in `.env`
- Verify MongoDB is accessible on the specified port

**2. Port Already in Use**
- Change the PORT in `.env` file
- Kill processes using the port: `npx kill-port 5000`

**3. Excel File Permission Error**
- Ensure the `data` directory has write permissions
- Check if the Excel file is open in another application

**4. CORS Errors**
- Verify the proxy setting in `client/package.json`
- Check that the backend is running on the correct port

### Debug Mode
To run in debug mode with more detailed logging:
```bash
DEBUG=* npm run dev
```

## 📈 Performance Considerations

- **Database Indexing**: Email field is indexed for faster queries
- **Excel File Optimization**: Efficient Excel operations with proper error handling
- **Frontend Optimization**: React components are optimized for performance
- **Memory Management**: Proper cleanup and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all dependencies are properly installed
4. Verify your environment configuration

---

**Happy Coding! 🎉** 