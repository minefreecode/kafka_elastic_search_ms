import { ICatalogRepository } from "../interface/catalogRepository.interface";

/**
 * Каталог сервиса
 */
export class CatalogService {
  private _repository: ICatalogRepository;

  /**
   * В конструкторе получаем репозиторий
   * @param repository
   */
  constructor(repository: ICatalogRepository) {
    this._repository = repository;
  }

  /**
   * Создаем товар
   * @param input
   */
  async createProduct(input: any) {
    const data = await this._repository.create(input);
    if (!data.id) {
      throw new Error("unable to create product");
    }
    return data;
  }

  /**
   * Обновляем товар
   *
   * @param input
   */
  async updateProduct(input: any) {
    const data = await this._repository.update(input);
    if (!data.id) {
      throw new Error("unable to update product");
    }
    // emit event to update record in Elastic search
    //При обновлении товара обновляем запись в Elastic search
    return data;
  }

  // instead of this we will get product from Elastic search
  async getProducts(limit: number, offset: number) {
    const products = await this._repository.find(limit, offset);

    return products;
  }

  async getProduct(id: number) {
    const product = await this._repository.findOne(id);
    return product;
  }

  async deleteProduct(id: number) {
    const response = await this._repository.delete(id);
    // delete record from Elastic search
    return response;
  }

  async getProductStock(ids: number[]) {
    const products = await this._repository.findStock(ids);
    if (!products) {
      throw new Error("unable to find product stock details");
    }
    return products;
  }
}
