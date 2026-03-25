# Use Node.js 18
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy dependencies first
COPY package*.json ./
RUN npm install

# Copy all files including seeder.js and server.js
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the server using your npm start command
CMD ["npm", "start"]