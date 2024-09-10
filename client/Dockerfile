# Use an official Node.js runtime as a base image
FROM node:22.8.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose the frontend port (3000 in this case)
EXPOSE 3000

# Start the frontend development server
CMD ["npm", "run", "start"]
