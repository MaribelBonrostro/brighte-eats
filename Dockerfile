# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
COPY --chown=node:node . .

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE ${PORT}

# Set environment variables for Drizzle ORM and PostgreSQL
ENV DATABASE_URL=postgresql://maribel:bonrostro@brighte:5432/brighte

# Start the application
CMD ["npm", "run", "dev"]