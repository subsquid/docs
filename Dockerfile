## Base ########################################################################
# Use a larger node image to do the build for native deps (e.g., gcc, python)
FROM node:16-alpine as base

# Reduce npm log spam and colour during install within Docker
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# We'll run the app as the `node` user, so put it in their home directory
WORKDIR /home/node/app
# Copy the source code over
COPY . /home/node/app/

## Production ##################################################################
# Also define a production target which doesn't use devDeps
FROM base as build
WORKDIR /home/node/app

RUN npm ci
# Build the Docusaurus app
RUN npm run build

## Deploy ######################################################################
# Use a stable nginx image
FROM nginx
WORKDIR /home/node/app
# Copy what we've installed/built from production

COPY --from=build /home/node/app/build/ /usr/share/nginx/html/
EXPOSE 80
