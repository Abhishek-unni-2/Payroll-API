FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# build TypeScript -> JavaScript
RUN npm run build

EXPOSE 3000

# run the compiled app, not the CLI
CMD ["node", "dist/main.js"]
