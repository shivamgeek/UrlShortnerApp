FROM node:18

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the React app source
COPY . .

EXPOSE 3000
CMD ["npm", "run dev"]
