FROM node:18
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3001
EXPOSE 8001
CMD ["npm", "start"]

ENV PORT=3001
ENV DB_PORT=20352
ENV DB_NAME=defaultdb
ENV DB_USER=avnadmin
ENV DB_HOST=mysql-bbcb407-torentino56-d5ca.aivencloud.com
ENV DB_PASSWORD=AVNS_iVj1dhVmNOIkEG33Bc0
