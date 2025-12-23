# Stage 1: Build Angular application
FROM node:18-alpine AS build

# Set NODE_OPTIONS to increase memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install

# Copy source code
COPY . .

# Build Angular application
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist/ecommerce /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]