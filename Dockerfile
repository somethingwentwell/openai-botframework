FROM node:14

# Create a directory for the bot
WORKDIR /app

# Copy the package.json and package-lock.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the bot code to the container
COPY . .

# Expose the port your bot listens on (replace 3978 with your bot's port number)
EXPOSE 3978

# Start the bot when the container starts
CMD [ "npm", "start" ]
