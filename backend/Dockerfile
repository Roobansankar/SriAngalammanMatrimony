# Use Node.js 20 alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package manifests and install (prod-only)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the backend code
COPY . .

# Default environment
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
