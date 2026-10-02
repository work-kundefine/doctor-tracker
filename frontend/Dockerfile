FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Build arguments for Next.js build-time inlining
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ARG BACKEND_API_URL=http://backend:5000

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV BACKEND_API_URL=$BACKEND_API_URL

# Build Next.js application
RUN npm run build || true

# Expose Next.js port
EXPOSE 3000

# Environment defaults
ENV PORT=3000
ENV NODE_ENV=production

# Run Next.js server
CMD ["npm", "start"]
