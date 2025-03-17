import { Consumer, Producer } from "kafkajs";
import { MessageBroker } from "../utils";
import { HandleSubscription } from "./order.service";
import { OrderEvent } from "../types";

//Инициализируем брокер
export const InitializeBroker = async () => {
  //Объект продюсера
  const producer = await MessageBroker.connectProducer<Producer>();
  producer.on("producer.connect", async () => {
    console.log("Producer connected successfully");
  });

  //Объект консумера
  const consumer = await MessageBroker.connectConsumer<Consumer>();
  consumer.on("consumer.connect", async () => {
    console.log("Consumer connected successfully");
  });

  // Прослушиваем Kafka на появление событий
  await MessageBroker.subscribe(HandleSubscription, "OrderEvents");
};

/**
 * Публикуем в Кафка сообщения о создании нового заказа
 */
export const SendCreateOrderMessage = async (data: any) => {
  await MessageBroker.publish({
    event: OrderEvent.CREATE_ORDER,
    topic: "CatalogEvents",
    headers: {},
    message: data,
  });
};

/**
 * Если имеются отмененые заказы публикует об этом сообщение в Кафка
 * @param data
 * @constructor
 */
export const SendOrderCanceledMessage = async (data: any) => {
  await MessageBroker.publish({
    event: OrderEvent.CANCEL_ORDER,
    topic: "CatalogEvents",
    headers: {},
    message: data,
  });
};
