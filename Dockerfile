# Use a Node.js base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

RUN npm install -g nodemon

# Install dependencies
RUN npm install

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Copy the rest of the application code
COPY . .

# Expose any necessary ports (e.g., if your Node.js app runs on a specific port)
EXPOSE 3000

# Specify the command to run your application
CMD [ "node", "index.js" ]
