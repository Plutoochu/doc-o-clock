# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm install

# Copy backend source code
COPY backend/ ./backend/

# Build backend
RUN cd backend && npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start", "--prefix", "backend"]
