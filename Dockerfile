# Use official Node.js 20 image
FROM node:20-alpine

# Create app directory
WORKDIR www/

# Copy package files first (better layer caching)
COPY www/package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the app source
COPY www/ .

# Build step (uncomment if you have a build script)
# RUN npm run build

WORKDIR falcontodo

# Expose the port your app runs on
EXPOSE 3000

# Start application
CMD ["npm", "run", "dev"]

# Next project "QR Code Generator"

# EOF

