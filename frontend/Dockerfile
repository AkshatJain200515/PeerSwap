# Use Node.js 18
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend source files
COPY . .

# Expose the Vite port
EXPOSE 5173

# Run the dev command with the --host flag to allow Docker access
CMD ["npm", "run", "dev", "--", "--host"]