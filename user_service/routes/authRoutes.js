const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

require("dotenv").config();

//Получаем объект роутера чтобы обрабатывать входящие запросы
const router = express.Router();

/**
 * Сгенерировать новый токен
 * @param user
 * @return {number | Promise<ArrayBuffer>}
 */
const gereateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Регистрация
 */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body; //Получаем из тела запроса переменные

  const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);//Делаем запрос для определения существует ли данный пользователь в БД

  if (userExists.rows.length > 0) {//Если уже существует сообщаем об этом
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10); //Хэшируем пароль чтобы хранить его в БД

  const newUser = await db.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );//Добавляем нового пользователя в БД

  return res
    .status(201)
    .json({ message: "User created", user: newUser.rows[0] });//Делаем ответ что пользователь создан
});

router.post("/login", async (req, res) => {
  //Получаем из тела запроса почту и пароль
  const { email, password } = req.body;

  //Делаем запрос для выбора пользователей из БД
  const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  //Пользователь не найден
  if (user.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  //Сравниваем пароли используя специальную функцию  bcrypt
  const validPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });//Если пароль не валидный делаем ответ с сервера
  }

  //Генерируем новый токен из идентификатора и почты пользователя
  const token = gereateToken({
    id: user.rows[0].id, //Идентификатор пользователя из строки пользователей
    email: user.rows[0].email, //Почта пользователя
  });

  return res.status(200).json({ message: "Login successful", token }); //Делаем ответ об успешной авторизации в системе
});

router.get("/validate", async (req, res) => {
  const token = req.headers["authorization"]; //Получаем токен авторизации
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });//Если токена нет выводим сразу сообщение об отсутствии авторизации
  }

  try {
    const tokenData = token.split(" ")[1];//Разделяем токен
    const user = jwt.verify(tokenData, process.env.JWT_SECRET); //Верификация по Jwt
    return res.status(200).json({ ...user }); //Отвечам об успешной верификации
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" }); //Неправильный токен
  }
});

module.exports = router;

/*
if you would like to use middleware to authorize routes, you can use the following code:

// Middleware to authorize routes
const requestAuthorizer = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  const tokenData = token.split(" ")[1];
  jwt.verify(tokenData, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

// Example of a protected route
 router.get("/profile", requestAuthorizer, async (req, res) => {

  // if user is authorized, their details will be available in req
  const authorisedUser = req.user;

   return res.json({ 
      message: "User profile fetched successfully",
      user: req.user,
    });
 });

 */
