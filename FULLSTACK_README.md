# .NET 8 Full Stack Application

A comprehensive full-stack application built with .NET 8 Web API backend and Angular frontend, demonstrating modern development patterns and integrations.

## 🚀 Features

### ✅ Backend (.NET 8 Web API)
- **Database Setup**: SQL Server with Entity Framework Core Code First
- **Identity Management**: ASP.NET Core Identity with role-based authentication
- **JWT Authentication**: Secure token-based authentication with bearer tokens
- **RESTful APIs**: Complete CRUD operations with Swagger documentation
- **SignalR Integration**: Real-time communication hub for notifications
- **Redis Stack**: Caching and pub/sub messaging
- **MongoDB Integration**: Document-based data storage
- **Firebase Integration**: Push notifications using Firebase Admin SDK
- **Repository Pattern**: Generic repository with CRUD base services
- **Automatic DI Registration**: Lifecycle marker interfaces for service registration

### ✅ Frontend (Angular)
- **JWT Integration**: Authentication service with token management
- **SignalR Client**: Real-time notifications and messaging
- **HTTP Interceptors**: Automatic token attachment and error handling
- **Reactive Forms**: Form validation and data binding
- **Bootstrap UI**: Modern, responsive user interface
- **Real-time Dashboard**: Live updates and notifications

## 🏗️ Architecture

```
FullStackApp/
├── Backend/
│   ├── FullStackApp.API/          # Web API project
│   ├── FullStackApp.Core/         # Domain entities, DTOs, interfaces
│   └── FullStackApp.Infrastructure/ # Data access, services, repositories
├── Frontend/
│   └── src/app/                   # Angular application
└── Database/
    ├── SQL Server                 # Relational data
    ├── MongoDB                    # Document storage
    └── Redis                      # Caching & messaging
```

## 🛠️ Prerequisites

### Backend Requirements
- .NET 8 SDK
- SQL Server (LocalDB or full instance)
- Redis Server
- MongoDB
- Visual Studio 2022 or VS Code

### Frontend Requirements
- Node.js (v16 or higher)
- npm or yarn
- Angular CLI

## 📦 Installation & Setup

### 1. Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd FullStackApp

# Restore NuGet packages
dotnet restore

# Update connection strings in appsettings.json
# - DefaultConnection: SQL Server connection string
# - Redis: Redis server connection string  
# - MongoDB: MongoDB connection string

# Run database migrations
cd Backend/FullStackApp.API
dotnet ef database update

# Start the API
dotnet run
```

The API will be available at `https://localhost:7001` with Swagger UI at the root.

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd src

# Install dependencies
npm install

# Add SignalR client (for Angular 7+)
npm install @microsoft/signalr

# Start the development server
ng serve
```

The frontend will be available at `http://localhost:4200`.

### 3. External Services Setup

#### Redis
```bash
# Using Docker
docker run -d --name redis-stack -p 6379:6379 redis/redis-stack-server:latest

# Or install locally
# Windows: Download from https://redis.io/download
# macOS: brew install redis
# Linux: sudo apt-get install redis-server
```

#### MongoDB
```bash
# Using Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Or install locally from https://www.mongodb.com/try/download/community
```

#### Firebase (Optional)
1. Create a Firebase project at https://console.firebase.google.com
2. Generate a service account key
3. Update the `Firebase:ServiceAccountKeyPath` in appsettings.json

## 🔧 Configuration

### Backend Configuration (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=FullStackAppDB;Trusted_Connection=true;MultipleActiveResultSets=true",
    "Redis": "localhost:6379",
    "MongoDB": "mongodb://localhost:27017"
  },
  "JwtSettings": {
    "Secret": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "FullStackApp",
    "Audience": "FullStackApp",
    "ExpirationInHours": "24"
  },
  "MongoDB": {
    "DatabaseName": "FullStackAppDB",
    "CollectionName": "Documents"
  },
  "Firebase": {
    "ServiceAccountKeyPath": "path/to/your/firebase-service-account-key.json"
  }
}
```

### Frontend Configuration (environment.ts)

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api',
  signalRUrl: 'https://localhost:7001/hubs/notifications'
};
```

## 🚀 Usage

### 1. Authentication
- Register a new user or login with existing credentials
- Admin user is seeded: `admin@example.com` / `Admin123!`
- JWT tokens are automatically managed by the Angular service

### 2. Real-time Features
- SignalR automatically connects when authenticated
- Receive live notifications and updates
- Test real-time features using the dashboard

### 3. API Testing
- Access Swagger UI at `https://localhost:7001`
- Use the "Authorize" button to add your JWT token
- Test all endpoints with real-time feedback

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/validate-token` - Token validation

### Products (CRUD Example)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Auth required)
- `PUT /api/products/{id}` - Update product (Auth required)
- `DELETE /api/products/{id}` - Delete product (Admin only)

### MongoDB Documents
- `GET /api/mongodocuments` - Get all documents
- `POST /api/mongodocuments` - Create document
- `GET /api/mongodocuments/search?searchTerm=...` - Search documents

### Firebase Notifications
- `POST /api/firebase/send-notification` - Send push notification
- `POST /api/firebase/send-topic-notification` - Send to topic

### SignalR Notifications
- `POST /api/notifications/broadcast` - Broadcast to all users
- `POST /api/notifications/send-to-user` - Send to specific user
- `POST /api/notifications/test` - Test SignalR connection

## 🔄 SignalR Hub Events

### Client Events (Receive)
- `ReceiveNotification` - General notifications
- `SystemNotification` - System-wide notifications
- `RoleNotification` - Role-specific notifications
- `TestMessage` - Test messages

### Server Events (Send)
- `JoinGroup(groupName)` - Join a group
- `SendMessageToGroup(groupName, message)` - Send to group
- `SendMessageToUser(userId, message)` - Send to user

## 🧪 Testing

### Backend Testing
```bash
# Run unit tests
dotnet test

# Test specific project
dotnet test Backend/FullStackApp.Tests
```

### Frontend Testing
```bash
# Run unit tests
ng test

# Run e2e tests
ng e2e
```

## 🏗️ Development Patterns

### 1. Repository Pattern
```csharp
public class ProductService : CrudBaseService<Product, ProductDto, int>
{
    public ProductService(IRepository<Product> repository) : base(repository) { }
    
    // Custom implementation
}
```

### 2. Automatic Service Registration
```csharp
public class MyService : IScopedService
{
    // Automatically registered as Scoped
}
```

### 3. Generic CRUD Operations
```csharp
public abstract class CrudBaseService<TEntity, TDto, TKey>
{
    public virtual async Task<TDto> CreateAsync(TDto dto) { }
    public virtual async Task<TDto> GetByIdAsync(TKey id) { }
    // ... other CRUD operations
}
```

## 🔒 Security Features

- JWT token-based authentication
- Role-based authorization
- CORS configuration
- Input validation and sanitization
- SQL injection prevention through EF Core
- XSS protection

## 📈 Performance Features

- Redis caching for frequently accessed data
- Database query optimization
- Connection pooling
- Async/await patterns throughout
- SignalR connection management

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure frontend URL is in `Cors:AllowedOrigins`
2. **Database Connection**: Check SQL Server is running and connection string is correct
3. **Redis Connection**: Verify Redis server is running on port 6379
4. **JWT Errors**: Check token expiration and secret key configuration
5. **SignalR Connection**: Ensure JWT token is being sent with SignalR requests

### Logs
- Backend logs: Console output and configured logging providers
- Frontend logs: Browser developer console
- Database logs: SQL Server logs or LocalDB event logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- ASP.NET Core team for the excellent framework
- Angular team for the robust frontend framework
- SignalR team for real-time communication capabilities
- Community contributors and package maintainers

---

**Happy Coding! 🚀**

For questions or support, please open an issue or contact the development team.