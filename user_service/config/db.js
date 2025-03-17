const { Pool } = require("pg");//Запрашиваем библиотеку для работы с Постгре
require("dotenv").config();//Загружаем переменные из .env в process.env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("connected to the db");
});//При соединении с Базой Данных выводим об этом сообщение

module.exports = {
  query: (text, params) => pool.query(text, params),
};//Добавляем для экспортирования функцию для выполнения sql-запросов
