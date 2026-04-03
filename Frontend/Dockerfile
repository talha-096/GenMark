# Use the official Node.js image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the Vite development port
EXPOSE 5173

# Start the application in development mode
# --host is required for Vite to be accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host"]
