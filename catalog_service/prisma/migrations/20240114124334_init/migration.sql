-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,-- Идентификатор
    "name" TEXT NOT NULL, --Имя
    "description" TEXT NOT NULL, --Описание
    "price" DOUBLE PRECISION NOT NULL, --Цена
    "stock" INTEGER NOT NULL, -- Сколько осталось

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
