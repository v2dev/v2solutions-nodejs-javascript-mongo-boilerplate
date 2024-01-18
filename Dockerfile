#Build Stage
FROM node:14-alpine AS build
ENV NODE_ENV development
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . .

#Final Stage
FROM node:14-alpine
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 8080
CMD [ "npm", "start" ]