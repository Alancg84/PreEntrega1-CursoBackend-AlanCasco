const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const manager = new ProductManager();

app.get('/products', async (req, res) => {
  try {
    await manager.init(); // Tengo que iniciar el manager antes de cargar o acceder a los productos

    const limit = req.query.limit;
    const products = limit ? manager.getProducts().slice(0, limit) : manager.getProducts();

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    await manager.init(); // Tengo que iniciar el manager antes de cargar o acceder a los productos

    const productId = parseInt(req.params.pid);
    const product = manager.getProductById(productId);

    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
