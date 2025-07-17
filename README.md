# Simple Task Manager

A full-stack task management application built with Node.js, Express, PostgreSQL, and Docker. This project demonstrates containerization, CI/CD pipelines, and AWS deployment practices.

## Features

- ✅ Create and view tasks
- 🐳 Docker containerization with Docker Compose
- 📊 Prometheus metrics integration
- 🚀 CI/CD pipeline with GitHub Actions
- ☁️ AWS EC2 deployment
- 📈 Performance monitoring (frontend load time tracking)

## Tech Stack

### Backend
- **Node.js** with Express framework
- **PostgreSQL** database
- **Prometheus** metrics collection
- **Docker** containerization

### Frontend
- **Vanilla HTML/CSS/JavaScript**
- **Performance monitoring** with Navigation Timing API

### DevOps
- **Docker Compose** for local development
- **GitHub Actions** for CI/CD
- **AWS EC2** for production deployment

## Project Structure

```
Simple-Task-Manager/
├── backend/
│   ├── index.js          # Main server file
│   ├── db.js             # Database connection
│   ├── package.json      # Backend dependencies
│   ├── dockerfile        # Backend Docker config
│   └── index.html        # Frontend served by backend
├── frontend/
│   └── index.html        # Standalone frontend
├── .github/workflows/
│   └── ci-cd.yml         # GitHub Actions pipeline
├── docker-compose.yml    # Docker Compose configuration
├── .env                  # Environment variables
├── wait-for-it.sh        # Database wait script
└── README.md
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (if running without Docker)

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:123456@db:5432/tasks_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=tasks_db
```

### Running with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Simple-Task-Manager
   ```

2. **Start the application:**
   ```bash
   docker compose up -d --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:7000
   - Metrics: http://localhost:7000/metrics

4. **Stop the application:**
   ```bash
   docker compose down
   ```

### Running Locally (Development)

1. **Start PostgreSQL database:**
   ```bash
   docker run -d \
     --name task-db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=123456 \
     -e POSTGRES_DB=tasks_db \
     -p 5432:5432 \
     postgres:15-alpine
   ```

2. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

### Tasks
- `GET /tasks` - Retrieve all tasks
- `POST /tasks` - Create a new task
  ```json
  {
    "title": "Task description"
  }
  ```

### Metrics
- `GET /metrics` - Prometheus metrics endpoint
- `POST /frontend-metrics` - Frontend performance metrics

## Monitoring and Metrics

The application includes comprehensive monitoring:

### Backend Metrics
- **HTTP Request Duration**: Response time tracking
- **Database Query Duration**: PostgreSQL query performance
- **Task Counter**: Number of tasks created

### Frontend Metrics
- **Page Load Time**: Frontend performance tracking
- **Navigation Timing**: Performance API integration

### Available Metrics
- `http_request_duration_ms` - HTTP request duration histogram
- `db_query_duration_ms` - Database query duration histogram
- `task_created_total` - Total tasks created counter
- `frontend_load_time_ms` - Frontend load time histogram

## Deployment

### GitHub Actions CI/CD

The project includes automated deployment to AWS EC2:

1. **Push to main branch** triggers the pipeline
2. **Build step** installs dependencies and runs tests
3. **Deploy step** connects to EC2 and updates the application

### AWS EC2 Setup

1. **EC2 Instance**: Ubuntu with Docker installed
2. **Security Group**: Port 7000 open for HTTP traffic
3. **SSH Access**: Configure SSH key in GitHub Secrets

### Environment Setup

Add these secrets to your GitHub repository:

```
EC2_SSH_KEY=<your-private-key>
```

The deployment script will:
- Pull latest code from GitHub
- Rebuild Docker containers
- Restart the application

## Database Schema

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);
```

## Docker Configuration

### Backend Container
- **Base Image**: `node:18-alpine`
- **Port**: 7000
- **Dependencies**: Waits for PostgreSQL before starting

### Database Container
- **Image**: `postgres:15-alpine`
- **Port**: 5432
- **Persistence**: Named volume for data storage

## Development Notes

### Key Features Implemented
- Database connection pooling
- Prometheus metrics collection
- Container orchestration with Docker Compose
- Automated CI/CD pipeline
- Frontend performance monitoring

### Performance Considerations
- 800ms artificial delay added to `/tasks` endpoint for testing
- Database query performance monitoring
- Frontend load time tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

## License

This project is for educational purposes and practicing Docker, AWS, and DevOps concepts.

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check environment variables
   - Verify network connectivity between containers

2. **Docker Build Failures**
   - Clear Docker cache: `docker system prune -a`
   - Check Dockerfile syntax
   - Verify base image availability

3. **CI/CD Pipeline Failures**
   - Check GitHub Secrets configuration
   - Verify SSH key permissions
   - Ensure EC2 instance is accessible

### Logs

View application logs:
```bash
# All services
docker compose logs

# Specific service
docker compose logs backend
docker compose logs db
```

