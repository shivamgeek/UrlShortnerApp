FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the application code
COPY . .
     
EXPOSE 5000
CMD ["npm", "start"]