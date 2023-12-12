const express = require('express');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager'); // Agregamos la importación del CartManager

const app = express();
const port = 8080;

const productManager = new ProductManager();
const cartManager = new CartManager(); // Creamos una instancia de CartManager

app.use(express.json()); // Middleware para parsear JSON

// Rutas para el manejo de productos
app.get('/api/products', async (req, res) => {
  try {
    await productManager.init();
    const limit = req.query.limit;
    const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:pid', async (req, res) => {
  try {
    await productManager.init();
    const productId = parseInt(req.params.pid);
    const product = productManager.getProductById(productId);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    await productManager.init();
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/products/:pid', async (req, res) => {
  try {
    await productManager.init();
    const productId = parseInt(req.params.pid);
    await productManager.updateProduct(productId, req.body);
    res.json({ message: 'Producto actualizado correctamente.' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.delete('/api/products/:pid', async (req, res) => {
  try {
    await productManager.init();
    const productId = parseInt(req.params.pid);
    await productManager.deleteProduct(productId);
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Rutas para el manejo de carritos
app.post('/api/carts', async (req, res) => {
  try {
    await cartManager.init();
    const newCart = await cartManager.addCart();
    res.status(201).json({ cart: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/carts/:cid', async (req, res) => {
  try {
    await cartManager.init();
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    res.json({ cart });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    await cartManager.init();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;
    await cartManager.addProductToCart(cartId, productId, quantity);
    res.json({ message: 'Producto agregado al carrito correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
