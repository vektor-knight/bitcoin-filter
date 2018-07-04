# Use official image.

FROM node:slim

COPY ./node .

RUN npm install

EXPOSE 3306

RUN chmod +x wait.sh

# This next line can be put into docker-compose,
# but was included as part of the Dockerfile context
# due to its logical relation to the execution of node
# app-code.

CMD ["./wait.sh", "mysql:3306", "--", "npm", "start"]
