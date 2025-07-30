# AutoChain - Workflow Automation Platform

AutoChain is a modern workflow automation platform that enables seamless integration between different services and applications. Built with scalability and real-time processing in mind, it leverages cutting-edge technologies to provide reliable automation solutions.

![AutoChain Banner](apps/frontend/public/banner.png)

## 🚀 Features

- **Webhook Integration**: Create custom HTTP endpoints to receive and process real-time data
- **Gmail Actions**: Automate email workflows with Gmail integration
- **Real-time Processing**: Powered by Apache Kafka for reliable event streaming
- **Scalable Architecture**: Microservices-based design for high availability
- **Modern UI**: Built with Next.js 14 and Tailwind CSS for a seamless user experience

## 🏗️ Project Structure

```
apps/
├── frontend/               # Next.js 14 frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── lib/          # Utility functions
│   └── public/           # Static assets
├── hooks/                # Shared hooks package
├── primary-backend/      # Main API service
├── processor/           # Event processing service
└── worker/             # Background job worker

packages/
├── database/           # Prisma database package
├── eslint-config/     # Shared ESLint configurations
├── http-status/       # HTTP status codes package
├── mailer-config/     # Email service configuration
├── typescript-config/ # Shared TypeScript configurations
├── ui/               # Shared UI components
└── zod-schemas/     # Shared validation schemas
```

## 🛠️ Technology Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Flow (for workflow builder)

### Backend
- Node.js
- Express
- TypeScript
- Prisma (ORM)
- Apache Kafka
- Redis (caching)

### Infrastructure
- Docker
- Kubernetes
- Apache Kafka
- Redis
- PostgreSQL

## 🌟 Core Components

### Event Processing Pipeline
- **Webhook Service**: Handles incoming webhook requests
- **Event Processor**: Processes events using Apache Kafka
- **Action Worker**: Executes automated actions

### Data Flow
1. Webhooks trigger events
2. Events are published to Kafka topics
3. Processor service consumes events
4. Worker executes corresponding actions
5. Results are stored and notifications sent

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Docker
- Apache Kafka
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd autochain
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development environment:
```bash
# Start infrastructure services
docker-compose up -d

# Start development servers
npm run dev
```

### Development Scripts

- `npm run dev`: Start all services in development mode
- `npm run build`: Build all packages and applications
- `npm run test`: Run tests across all packages
- `npm run lint`: Run linting across all packages

## 📦 Deployment

The platform can be deployed using Docker and Kubernetes:

```bash
# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Deploy to Kubernetes
kubectl apply -f k8s/
```

## 🔄 Event Processing Architecture

### Kafka Topics
- `incoming-webhooks`: Raw webhook events
- `processed-events`: Validated and transformed events
- `action-queue`: Actions ready for execution
- `action-results`: Execution results

### Processing Stages
1. **Event Ingestion**: Webhooks → Kafka
2. **Event Processing**: Validation and transformation
3. **Action Execution**: Task processing and external API calls
4. **Result Handling**: Status updates and notifications

## 🔐 Security Features

- JWT-based authentication
- Rate limiting for webhooks
- Request validation using Zod
- Secure credential storage
- CORS protection

## 🎯 Future Roadmap

- [ ] Slack integration
- [ ] Discord webhooks
- [ ] Scheduled triggers (cron jobs)
- [ ] Custom API integration
- [ ] Advanced workflow builder
- [ ] Workflow templates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

Built with ❤️ by the AutoChain Team
