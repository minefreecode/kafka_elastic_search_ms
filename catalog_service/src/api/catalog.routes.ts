import express, { NextFunction, Request, Response } from "express";
import { CatalogService } from "../services/catalog.service";
import { CatalogRepository } from "../repository/catalog.repository";
import { RequestValidator } from "../utils/requestValidator";
import { CreateProductRequest, UpdateProductRequest } from "../dto/product.dto";

const router = express.Router();

export const catalogService = new CatalogService(new CatalogRepository());

// Маршрут для создания товара
router.post(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await RequestValidator(
        CreateProductRequest,
        req.body
      );//Валидируем тело запроса

      if (errors) return res.status(400).json(errors); //Если ошибки сообщаем об этом
      const data = await catalogService.createProduct(input); //Создаем товар
      return res.status(201).json(data); //Делаем ответ о созданном товаре с кодом 201
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message); //Сообщаем об ошибке
    }
  }
);

router.patch(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await RequestValidator(
        UpdateProductRequest,
        req.body
      );//Делаем валидацию тела реквеста

      const id = parseInt(req.params.id) || 0; //Получаем идентификатор

      if (errors) return res.status(400).json(errors); //Сообщаем об ошибке

      const data = await catalogService.updateProduct({ id, ...input }); //Обновляем товар
      return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

router.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = Number(req.query["limit"]);
    const offset = Number(req.query["offset"]);
    try {
      const data = await catalogService.getProducts(limit, offset);
      return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

router.get(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id) || 0;
    try {
      const data = await catalogService.getProduct(id);
      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }
);

router.delete(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id) || 0;
    try {
      const data = await catalogService.deleteProduct(id);
      return res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  }
);

router.post("/products/stock", async (req: Request, res: Response) => {
  try {
    const data = await catalogService.getProductStock(req.body.ids);
    return res.status(200).json(data);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

export default router;
