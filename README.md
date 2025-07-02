# Career Evaluation System

A comprehensive career evaluation platform for software engineering teams, featuring radar chart visualizations, self-assessment capabilities, and leader evaluations.

## Features

- **Self-Evaluation**: Assess your skills across 7 key criteria
- **Leader Assessment**: Get evaluated by your team lead or manager
- **Google OAuth Integration**: Sign in with Google alongside traditional authentication
- **Role-based Access Control**: Manager and team member permissions
- **Inline Expectations Editing**: Managers can edit team member expectations directly
- **Radar Charts**: Interactive visualizations using Recharts
- **Gap Analysis**: Compare self and leader evaluations
- **Export Functionality**: Download comparison results as CSV
- **Mobile Responsive**: Works on all device sizes
- **Real-time Updates**: Auto-save functionality

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Node.js + Express
- **Database**: SQLite with automatic schema migration
- **Authentication**: JWT + Passport.js (Google OAuth 2.0)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Session Management**: Express Sessions
- **Routing**: React Router

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-evaluation-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**
   ```bash
   # Backend
   cd ../backend
   cp .env.example .env
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   ```

5. **Initialize Database**
   ```bash
   cd ../backend
   npm run init-db
   ```

6. **Configure Google OAuth (Optional)**
   
   For Google OAuth integration, see detailed setup in [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
   
   Quick setup:
   ```bash
   # Copy environment template
   cp environment.example .env
   
   # Add your Google OAuth credentials to .env:
   # GOOGLE_CLIENT_ID=your-google-client-id
   # GOOGLE_CLIENT_SECRET=your-google-client-secret
   # REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

7. **Start the Application**
   
   **Development mode** (runs both backend and frontend):
   ```bash
   npm run dev
   ```
   
   **Or manually** (Terminal 1):
   ```bash
   node server-db.js
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend && npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Project Structure

```
career-evaluation-system/
├── backend/
│   ├── server.js                 # Main server file
│   ├── database/
│   │   ├── init.js              # Database initialization
│   │   ├── schema.sql           # Database schema
│   │   └── evaluation.db        # SQLite database (created automatically)
│   ├── routes/
│   │   ├── evaluations.js       # Evaluation API routes
│   │   └── users.js             # User API routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RadarChart.tsx    # Radar chart visualization
│   │   │   ├── EvaluationForm.tsx # Evaluation form
│   │   │   ├── ComparisonView.tsx # Comparison interface
│   │   │   ├── Navigation.tsx    # Navigation component
│   │   │   └── Toast.tsx         # Toast notifications
│   │   ├── pages/
│   │   │   ├── HomePage.tsx      # Team overview page
│   │   │   ├── UserDashboard.tsx # User dashboard
│   │   │   ├── EvaluationPage.tsx # Evaluation forms
│   │   │   └── ComparisonPage.tsx # Comparison results
│   │   ├── data/
│   │   │   └── evaluationCriteria.ts # Evaluation criteria definitions
│   │   ├── types/
│   │   │   └── types.ts          # TypeScript type definitions
│   │   ├── App.tsx               # Main App component
│   │   └── index.tsx             # Entry point
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Evaluation Criteria

The system evaluates 7 key areas:

1. **Technical Knowledge (Ownership)** - Programming skills and technical expertise
2. **System Design (Quality)** - Architecture and design capabilities
3. **Problem Solving (Honesty)** - Analytical thinking and debugging skills
4. **Code Quality & Testing (Quality)** - Clean code and testing practices
5. **Collaboration & Communication (People)** - Teamwork and communication skills
6. **Technical Leadership** - Mentoring and technical guidance abilities
7. **Impact & Scope (Ownership + Quality)** - Breadth and depth of impact

Each criterion is rated on a 0-5 scale:
- **0**: Beginner
- **1**: Learning  
- **2**: Developing
- **3**: Proficient
- **4**: Advanced
- **5**: Expert

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:slug` - Get specific user

### Evaluations
- `POST /api/evaluations` - Create/update evaluation
- `GET /api/evaluations/:userId/latest` - Get latest evaluations
- `GET /api/evaluations/:userId/history` - Get evaluation history
- `PUT /api/evaluations/:id` - Update existing evaluation

## Default Team Members

The system comes pre-configured with these team members:

- **Fede Cano** - Tech Lead
- **Alton Bell** - Tech Lead
- **Fede Miranda** - Semi-Senior Engineer
- **Jose Biskis** - Senior Engineer
- **Leo Paini** - Senior Engineer
- **Santi Musso** - Junior Engineer
- **Javi Mermet** - Senior Engineer

## Authentication

The system supports multiple authentication methods:

### Traditional Login
- **Manager**: `manager@company.com` / `manager123`
- **Team Members**: `[name]@company.com` / `password123`

### Google OAuth
- Click "Continue with Google" on the login page
- New users are automatically created with `team_member` role
- Existing users with matching emails are automatically linked

### Role-based Access
- **Managers**: Full access to all team data and expectations editing
- **Team Members**: Access to personal dashboard and evaluations

## Development

### Running in Development Mode

**Backend**:
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Frontend**:
```bash
cd frontend
npm start    # Runs with hot reload
```

### Database Management

**Reset Database**:
```bash
cd backend
rm database/evaluation.db
npm run init-db
```

**View Database**:
```bash
cd backend/database
sqlite3 evaluation.db
.tables
.schema
```

## Deployment

### Environment Variables

**Backend (.env)**:
```
PORT=3001
LEADER_PASSWORD=your-secure-password
NODE_ENV=production
```

**Frontend (.env)**:
```
REACT_APP_API_URL=https://your-backend-domain.com
```

### Build for Production

**Frontend**:
```bash
cd frontend
npm run build
```

The build folder will contain the optimized production build.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on the GitHub repository. 