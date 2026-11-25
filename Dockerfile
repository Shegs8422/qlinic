# Stage 1: Build the Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Build for production
ENV NODE_ENV=production
ENV VITE_BASE_PATH=/
# BetterAuth requires a secret even at build time (vite.config.ts imports it).
# Override with a build-time secret; production auth is handled by Zustand stores.
ARG BETTER_AUTH_SECRET=qlinic-build-secret-change-in-production
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
