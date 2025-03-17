import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"; //Импортируем из класса валидатора
//Валидатор "Создать продукт"
export class CreateProductRequest {
  @IsString() //Это строка
  @IsNotEmpty() //Она не пустая
  name: string;

  @IsString() //Это строка
  description: string;

  @IsNumber() //Оно число
  @Min(1) //Минимальное чсило 1
  price: number;

  @IsNumber() //Это число
  stock: number;
}

//Валилдатор "Обновить продукт"
export class UpdateProductRequest {
  name?: string; //Необязатоельное имя товара

  description?: string; //Необязательное описание

  price?: number; //Необъязательная цена

  @IsNumber() // Необязательное количество товара, является ли оно числом
  stock?: number;
}
