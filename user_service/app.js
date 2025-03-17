const express = require("express"); //Добавляем express в проект
const authRoutes = require("./routes/authRoutes"); //Импортируем маршруты

const app = express(); //Создаём объект express

const PORT = process.env.PORT || 9000; //Порт

app.use(express.json());

app.use("/auth", authRoutes); //Добавляем маршруты для обращения по http

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});//Запускаем express-сервер
