const fs = require('fs').promises;

class ProductManager {
  constructor() {
    this.path = 'products.json';
    this.products = [];
  }

  async init() {
    try {
      await this.loadProducts();
    } catch (error) {
      console.error('Error al inicializar ProductManager:', error);
    }
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, se creará al agregar el primer producto
      this.products = [];
    }
  }

  async saveProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
  }

  generateUniqueId() {
    return Date.now();
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    // Verificar si el código ya existe
    if (this.products.some(product => product.code === code)) {
      throw new Error('El código del producto ya está en uso.');
    }

    // Generar un id único
    const id = this.generateUniqueId();

    // Crear el objeto producto
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    // Agregar el producto al array de productos
    this.products.push(newProduct);

    // Guardar productos en el archivo
    await this.saveProducts();

    // Devolver el objeto producto creado
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find(product => product.id === productId);

    if (!product) {
      throw new Error('Producto no encontrado.');
    }

    return product;
  }

  async updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    // Actualizar el producto sin cambiar su id
    this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };

    // Guardar productos actualizados en el archivo
    await this.saveProducts();
  }

  async deleteProduct(productId) {
    const productIndex = this.products.findIndex(product => product.id === productId);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado.');
    }

    // Eliminar el producto del array
    this.products.splice(productIndex, 1);

    // Guardar productos actualizados en el archivo
    await this.saveProducts();
  }
}

module.exports = ProductManager;
