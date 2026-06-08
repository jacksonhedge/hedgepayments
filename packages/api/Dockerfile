# @hedge/api — the Hedge / Chance backend (Express + TS).
# The website is a static export and can't run server code, so this service is THE backend.
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
# Health: GET /health → {status:"ok"}
CMD ["node", "dist/index.js"]
