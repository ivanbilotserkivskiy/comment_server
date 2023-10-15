FROM node:18
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]

ENV PORT=3001
ENV DB_PORT=3306
ENV DB_NAME=db_comment
ENV DB_USER=mysql
ENV DB_HOST=localhost
ENV DB_PASSWORD=mysql123
