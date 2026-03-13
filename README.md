# NeoConnect - Staff Feedback & Complaint Management Platform

A comprehensive full-stack web application for transparent employee feedback and complaint tracking, built with modern technologies.

## 🚀 Features

### Core Functionality
- **Anonymous Complaint Submission**: Employees can submit feedback safely without revealing identity
- **Unique Tracking IDs**: Each case gets a formatted ID (NEO-YYYY-001)
- **Role-Based Access Control**: Staff, Case Managers, Secretariat, and Admin roles
- **Real-time Case Tracking**: Monitor complaint progress through 6 status levels
- **File Upload Support**: Attach images or PDFs to complaints
- **Automated Escalation**: Cases auto-escalate after 7 days of inactivity

### Dashboard Features
- **Secretariat Dashboard**: Case inbox, assignment, poll creation, analytics
- **Case Manager Dashboard**: Assigned cases, status updates, note-taking
- **Staff Dashboard**: Personal case tracking, poll voting
- **Analytics Dashboard**: Visual charts for case distribution and hotspots

### Public Features
- **Impact Tracking Table**: View resolved cases and outcomes
- **Meeting Minutes Archive**: Upload and search meeting documents
- **Polling System**: Create polls, vote once, view results
- **Company Announcements**: Broadcast important updates

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** + **shadcn/ui** components
- **Framer Motion** for animations
- **JWT** for authentication persistence

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT Authentication**
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Deployment
- **Frontend**: Vercel
- **Backend**: Render/Railway
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
neoconnect/
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # Reusable UI components
│   │   ├── lib/                 # Utilities and API client
│   │   └── hooks/               # Custom React hooks
│   ├── public/                  # Static assets
│   └── package.json
├── backend/
│   ├── controllers/             # Route handlers
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth, upload, validation
│   ├── utils/                   # Helper functions
│   └── server.js                # Express server
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neoconnect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_jwt_secret
```

## 👥 User Roles & Permissions

### Staff
- Submit complaints (anonymous option)
- Upload files (images/PDFs)
- Vote in polls
- Track personal cases
- View public announcements

### Secretariat
- View all complaints
- Assign cases to managers
- Create and manage polls
- Upload meeting minutes
- Access analytics dashboard
- Post company announcements

### Case Manager
- View assigned cases
- Update case status
- Add resolution notes
- Mark cases as resolved
- Access case history

### Admin
- Full system access
- User management
- Role configuration
- System monitoring

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Cases
- `POST /api/cases` - Create new case
- `GET /api/cases` - Get cases (filtered by role)
- `PUT /api/cases/:id` - Update case status/notes
- `DELETE /api/cases/:id` - Delete case (admin only)

### Polling
- `POST /api/polls` - Create poll
- `GET /api/polls` - Get all polls with results
- `POST /api/polls/:id/vote` - Vote in poll

### Analytics
- `GET /api/analytics` - Dashboard analytics data

### Public
- `GET /api/public/digest` - Resolved cases and announcements
- `GET /api/public/minutes` - Meeting minutes archive

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure authentication with expiration
- **Role-Based Middleware**: API access control
- **File Upload Validation**: Type and size restrictions
- **Input Sanitization**: Prevent XSS attacks

## 📈 Case Lifecycle

1. **New** → Initial submission
2. **Assigned** → Assigned to case manager
3. **In Progress** → Active investigation
4. **Pending** → Awaiting additional information
5. **Resolved** → Case closed with solution
6. **Escalated** → Auto-escalated after 7 days

## 🎯 Key Workflows

### Complaint Submission
1. Staff fills complaint form
2. Optional anonymous submission
3. File attachment support
4. Automatic tracking ID generation
5. Email notification to secretariat

### Case Resolution
1. Secretariat assigns to case manager
2. Manager updates status and adds notes
3. For resolution: Add action taken and result
4. Case appears in public impact tracking

### Polling System
1. Secretariat creates poll with question and options
2. Staff vote once per poll
3. Real-time results with percentage bars
4. Historical poll data maintained

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel with vercel CLI or GitHub integration
```

### Backend (Render/Railway)
```bash
# Set environment variables in hosting platform
# Deploy from GitHub repository
# Set build command: npm install
# Set start command: npm start
```

### Database (MongoDB Atlas)
- Create cluster
- Whitelist IP addresses
- Create database user
- Get connection string

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend build test
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ for transparent workplace communication**