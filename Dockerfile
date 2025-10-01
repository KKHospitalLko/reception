# Example minimal Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# ✅ Copy the .env file before building
COPY .env .  

COPY . .
RUN npm run build

CMD ["npm", "start"]