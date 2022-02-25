# Docker image for Varaamo

# Install dependencies
FROM node:14-alpine AS deps
ENV NPM_CONFIG_LOGLEVEL warn

# defaults to production, docker-compose dev overrides this to development on build and run.
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app
COPY package.json package-lock.json ./

RUN if [ "$NODE_ENV" = "production" ]; \
  then npm ci --only=production && npm cache clean --force; \
  else npm install; \
  fi

# Create build
FROM node:14-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/package.json /app/package-lock.json ./
COPY . .
RUN npm run build

# Create production image
FROM node:14-alpine AS runner

# defaults to production, docker-compose dev overrides this to development on build and run.
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# set babel cache under tmp to allow writes for non root users
ENV BABEL_CACHE_PATH=/tmp/babel_cache.json

WORKDIR /usr/src/app

# copy desired files
COPY --from=builder /app/package.json /app/.babelrc ./

# copy individual folders
COPY --from=builder /app/config ./config
COPY --from=builder /app/server ./server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# set user to not be root
USER node
CMD ["node", "server/index.js"]
