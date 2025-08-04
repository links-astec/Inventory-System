# Inventory Management System

A comprehensive inventory management system with role-based authentication for administrators and sales personnel.

## Features

- **Dual Authentication System**: Separate login for administrators and sales personnel
- **Token-Based Access Control**: Sales personnel require tokens from administrators
- **Admin Dashboard**: Supervise sales personnel, manage inventory, view analytics
- **Sales Dashboard**: Access assigned inventory, record sales, manage customers
- **Real-time Notifications**: Stock alerts and system notifications
- **Audit Trail**: Complete tracking of all inventory changes

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **Authentication**: JWT tokens
- **Icons**: Lucide React
- **Development**: Vite + Concurrently

## Prerequisites

Make sure you have the following installed:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **VS Code** (recommended editor)

## VS Code Setup Instructions

### 1. Clone or Download the Project

If you have the project files, open VS Code and:
- File → Open Folder → Select the project directory

### 2. Install Required VS Code Extensions (Recommended)

Open VS Code Extensions (Ctrl+Shift+X) and install:
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **Thunder Client** (for API testing)

### 3. Open Integrated Terminal

In VS Code, open the terminal:
- View → Terminal (or Ctrl+`)

### 4. Install Dependencies

Run the following command in the terminal:

```bash
npm install
```

This will install all required libraries including:

#### Frontend Dependencies:
- `react` - React library
- `react-dom` - React DOM rendering
- `lucide-react` - Icon library
- `@types/react` - TypeScript types for React
- `@types/react-dom` - TypeScript types for React DOM

#### Backend Dependencies:
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware
- `morgan` - HTTP request logger
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token handling
- `better-sqlite3` - SQLite database
- `uuid` - UUID generation
- `nodemailer` - Email notifications

#### Development Dependencies:
- `vite` - Build tool and dev server
- `typescript` - TypeScript compiler
- `tailwindcss` - CSS framework
- `autoprefixer` - CSS post-processor
- `postcss` - CSS processor
- `concurrently` - Run multiple commands
- `nodemon` - Auto-restart server
- `eslint` - Code linting

### 5. Start the Development Server

Run the following command to start both frontend and backend:

```bash
npm run dev
```

This command will:
- Start the backend server on `http://localhost:3001`
- Start the frontend development server on `http://localhost:5173`
- Automatically open your browser to the application

### 6. Alternative: Run Frontend and Backend Separately

If you prefer to run them separately:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

## Default Login Credentials

### Administrator Account:
- **Email**: `admin@company.com`
- **Password**: `admin123`

### Sales Personnel Account:
- **Email**: `john@company.com`
- **Password**: `sales123`
- **Token**: `TOKEN123`

### Additional Sales Account:
- **Email**: `sarah@company.com`
- **Password**: `sales123`
- **Token**: `TOKEN456`

## Project Structure

```
inventory-management-system/
├── backend/                 # Backend server files
│   ├── database/           # Database initialization
│   ├── middleware/         # Authentication middleware
│   ├── routes/            # API route handlers
│   ├── services/          # Business logic services
│   └── server.js          # Main server file
├── src/                   # Frontend React application
│   ├── components/        # React components
│   ├── context/          # React context providers
│   ├── services/         # API service layer
│   ├── types/            # TypeScript type definitions
│   └── App.tsx           # Main App component
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Buyers
- `GET /api/buyers` - List buyers
- `POST /api/buyers` - Create buyer
- `GET /api/buyers/:id` - Get buyer details
- `PUT /api/buyers/:id` - Update buyer
- `DELETE /api/buyers/:id` - Delete buyer

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Record sale
- `GET /api/transactions/:id` - Get transaction details
- `PATCH /api/transactions/:id/status` - Update status

### User Management (Admin only)
- `GET /api/users/sales` - List sales personnel
- `POST /api/users/sales` - Create sales personnel
- `POST /api/users/sales/:id/token` - Generate access token
- `PATCH /api/users/sales/:id/activate` - Activate user
- `PATCH /api/users/sales/:id/deactivate` - Deactivate user

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id` - Mark as read
- `PATCH /api/notifications` - Mark all as read

## Database

The system uses SQLite database with the following tables:
- `users` - User accounts and authentication
- `products` - Product inventory
- `buyers` - Customer information
- `transactions` - Sales records
- `stock_logs` - Inventory change audit trail
- `notifications` - System notifications

## Troubleshooting

### Port Already in Use
If you get a port error, you can change the ports in:
- Backend: Edit `backend/server.js` (line with `PORT`)
- Frontend: Vite will automatically find an available port

### Database Issues
The SQLite database is automatically created on first run. If you need to reset it:
1. Stop the server
2. Delete `backend/database/inventory.db`
3. Restart the server

### Permission Issues
If you get permission errors on Windows:
```bash
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
```

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Testing**: Use Thunder Client extension or Postman
3. **Database Viewing**: Use SQLite Browser to view database
4. **Debugging**: Use VS Code debugger with Node.js configuration

## Production Deployment

For production deployment:
1. Run `npm run build` to create production build
2. Serve the `dist` folder with a web server
3. Configure environment variables for production database
4. Set up proper SSL certificates
5. Configure reverse proxy (nginx recommended)

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure Node.js version is 16 or higher
4. Check that ports 3001 and 5173 are available