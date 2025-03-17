import { ExpressApp } from "./express-app";//Импорт модуля где описывается сервер
import { logger } from "./utils";//Полоучаем логгер для логгирования

const PORT = process.env.APP_PORT || 9002;//Получаем порт

export const StartServer = async () => {
  const expressApp = await ExpressApp();
  expressApp.listen(PORT, () => {
    logger.info(`App is listening to ${PORT}`);
  });//Запусаем возможность прослушивания данного сервера

  process.on("uncaughtException", async (err) => {
    logger.error(err);
    process.exit(1);
  });
};

/**
 * Запускаем сервер
 */
StartServer().then(() => {
  logger.info("server is up");
});
