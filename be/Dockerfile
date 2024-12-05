FROM node:18-bullseye-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Rebuild native dependencies
RUN npm rebuild @swc/core --build-from-source

# Copy source code
COPY . .

# Build the Strapi project
RUN npm run build -- --debug

# Expose the port
EXPOSE 1337

# Run the Strapi app
CMD ["npm", "start"]
