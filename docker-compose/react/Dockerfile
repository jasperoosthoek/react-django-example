# pull official base image
FROM node:16-buster-slim

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY frontend/package.json ./
COPY frontend/package-lock.json ./

RUN npm install \
    && npm install react-scripts@5.0.1 -g
# RUN npm install react-icons@4.2.0 speakingurl
    # https://stackoverflow.com/questions/67087735/eacces-permission-denied-mkdir-usr-app-node-modules-cache-how-can-i-creat
RUN mkdir /app/node_modules/.cache && chmod -R 777 /app/node_modules/.cache
# RUN rm -rf /root/.npm/_logs && mkdir -p /root/.npm/_logs && chmod -R 777 /app/node_modules/.cache

# add app
COPY . ./

# start and install
# CMD ["npm", "run", "install-start"]
CMD ["npm", "run", "start"]
