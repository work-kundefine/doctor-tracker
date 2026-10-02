FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose backend port
EXPOSE 5000

# Default environment variables
ENV PORT=5000
ENV NODE_ENV=production

# Run the standalone backend server
CMD ["npm", "start"]
