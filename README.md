# Robin - Modern Coupon Claiming Platform

![Robin Logo](frontend/public/robin-logo.png)

Robin is a full-stack web application that allows users to claim and manage promotional coupons with a beautiful, animated UI. The application includes an admin dashboard for managing coupons, tracking claims, and monitoring user activity.

## Features

### User Features
- **Beautiful Animated UI**: Smooth animations using Framer Motion make the user experience delightful
- **Coupon Claiming**: Users can claim exclusive promotional coupons with a single click
- **Cooldown System**: Prevents abuse with a visually displayed cooldown period after claiming
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Admin Features
- **Comprehensive Dashboard**: Manage all aspects of the coupon system
- **Coupon Management**: Create, edit, activate/deactivate, and delete coupons
- **Claim History**: View detailed history of all coupon claims
- **User Management**: Inspect users and view their claimed coupons
- **Search Functionality**: Quickly find specific users or information

## Technology Stack

### Frontend
- **React**: UI library for building the interface
- **React Router**: For routing and navigation
- **Tailwind CSS**: For styling and responsive design
- **Framer Motion**: For beautiful animations and transitions
- **React Icons**: For consistent iconography
- **Axios**: For API communication

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing coupons, users, and claim data
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: For secure authentication
- **Cookies**: For secure session management
- **Swagger**: For API documentation

## Architecture

### Frontend Architecture
The frontend follows a component-based architecture using React. Key components include:
- **Navbar**: Navigation and authentication display
- **HomePage**: Coupon claiming interface with animated elements
- **AdminDashboard**: Interface for managing coupons, users, and viewing claim history
- **AuthContext**: Global authentication state management

### Backend Architecture
The backend follows a Model-View-Controller (MVC) pattern:
- **Models**: Define data structure for Coupons, Users, and ClaimHistory
- **Controllers**: Handle business logic for each resource
- **Routes**: Define API endpoints and middleware
- **Middleware**: Handle authentication, rate limiting, and IP tracking

## Security Features
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Rate Limiting**: Prevents abuse of the coupon claiming system
- **IP Tracking**: Monitors and limits claims from the same IP address
- **Role-Based Access**: Admin-only routes and functionality

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas)
- NPM or Yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/robin.git
cd robin
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/robin
JWT_SECRET=your-secret-key
NODE_ENV=development
COOLDOWN_PERIOD=3600000  # 1 hour in milliseconds
```

5. Create a `.env` file in the frontend directory with:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Access the application at `http://localhost:3000`

## API Documentation

The API is documented using Swagger. Once the backend is running, you can access the API documentation at:

```
http://localhost:5000/api-docs
```

Key API endpoints include:

### Public Endpoints
- `POST /api/coupons/claim`: Claim a coupon
- `GET /api/coupons/last-claimed`: Get last claimed coupon and cooldown info
- `POST /api/users`: Register a new user
- `POST /api/users/login`: Login user
- `POST /api/users/logout`: Logout user

### Protected Endpoints (Admin only)
- `GET /api/coupons`: Get all coupons
- `GET /api/coupons/:id`: Get coupon by ID
- `POST /api/coupons`: Create a new coupon
- `PUT /api/coupons/:id`: Update a coupon
- `DELETE /api/coupons/:id`: Delete a coupon
- `GET /api/history`: Get all claim history
- `GET /api/history/user/:userId`: Get claim history by user
- `GET /api/history/user/:userId/detailed`: Get detailed coupon claim history by user
- `GET /api/users`: Get all users

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- UI styling by [Tailwind CSS](https://tailwindcss.com/) 