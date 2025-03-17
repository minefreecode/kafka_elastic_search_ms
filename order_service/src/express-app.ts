import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { InitializeBroker } from "./service/broker.service";

export const ExpressApp = async () => {
  const app = express(); //Создаем объект сервера
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);

  await InitializeBroker(); //Инициализация брокера кафки

  app.use(cartRoutes);//Подключаем маршруты для работы с корзиной
  app.use(orderRoutes);//Подключаем маршруты для работы с заказами

  app.use("/", (req: Request, res: Response, _: NextFunction) => {
    return res.status(200).json({ message: "I am healthy!" });
  }); //Если делаем такой запрос /, то возвращаем сообщенеи что я в порядке

  app.use(HandleErrorWithLogger);

  return app;
};
