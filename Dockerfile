FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Serve the built application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]