# Use a Node runtime
FROM node:20-alpine

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# ✅ Declare build-time variables (no secrets here)
ARG VITE_BACKEND_URL
ARG VITE_API_KEY
ARG VITE_JYOTI_PASSWORD
ARG VITE_RITESH_PASSWORD
ARG VITE_SHALINI_PASSWORD
ARG VITE_RINKU_PASSWORD
ARG VITE_BABLOO_PASSWORD

# ✅ Make them available to Vite during build
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_JYOTI_PASSWORD=$VITE_JYOTI_PASSWORD
ENV VITE_RITESH_PASSWORD=$VITE_RITESH_PASSWORD
ENV VITE_SHALINI_PASSWORD=$VITE_SHALINI_PASSWORD
ENV VITE_RINKU_PASSWORD=$VITE_RINKU_PASSWORD
ENV VITE_BABLOO_PASSWORD=$VITE_BABLOO_PASSWORD

# Copy rest of the project
COPY . .

# Build frontend (Vite reads envs here)
RUN npm run build

# Start command
CMD ["npm", "start"]