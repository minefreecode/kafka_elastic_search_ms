import { Product } from "../models/product.model";

//Объявление интерфеса "Репозиторий"
export interface ICatalogRepository {
  /**
   * Создать
   *
   * @param data Товар
   *
   * @return Promise<Product>  На выходе товар
   */
  create(data: Product): Promise<Product>; //Создать
  update(data: Product): Promise<Product>; //Обновить
  delete(id: any); //Удалить
  find(limit: number, offset: number): Promise<Product[]>; //Найти
  findOne(id: number): Promise<Product>; //Найти один
  findStock(ids: number[]): Promise<Product[]>; //
}
