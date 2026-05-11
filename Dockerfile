# Stage 1: Build the Quasar SPA
FROM node:14-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx quasar build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist/spa/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
