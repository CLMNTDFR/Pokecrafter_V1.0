# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the backend port (5000 in this case)
EXPOSE 5000

# Start the backend server using nodemon for development (use node for production)
CMD ["npm", "run", "start"]
