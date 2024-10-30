FROM node:20

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npx sequelize-cli db:migrate && npm start"]