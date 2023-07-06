import { Router } from "express";
import ManagerMongoDb from "../dao/ManagerMongoDb.js";

const router = Router();
const productManger = new ManagerMongoDb.ProductManger();

router.get("/product", async (req, res) => {
  try {
    const products = await productManger.getProduct();
    res.send(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/product", async (req, res) => {
  const newProduct = {
    ...req.body,
  };
  try {
    const response = await productManger.createProduct(newProduct);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/product/:id", async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  try {
    const response = await productManger.updateProduct(id, product);
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await productManger.deleteProduct(id);
    res.send({
      message: "Producto Eliminado",
      id: id,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;