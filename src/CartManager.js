const fs = require('fs').promises;

class CartManager {
  constructor() {
    this.path = 'cart.json';
    this.carts = [];
  }

  async init() {
    try {
      await this.loadCarts();
    } catch (error) {
      console.error('Error al inicializar CartManager:', error);
    }
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, se creará al agregar el primer carrito
      this.carts = [];
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
  }

  generateUniqueId() {
    return Date.now();
  }

  async addCart() {
    // Generar un id único
    const id = this.generateUniqueId();

    // Crear el objeto carrito
    const newCart = {
      id,
      products: [],
    };

    // Agregar el carrito al array de carritos
    this.carts.push(newCart);

    // Guardar carritos en el archivo
    await this.saveCarts();

    // Devolver el objeto carrito creado
    return newCart;
  }

  getCartById(cartId) {
    const cart = this.carts.find((cart) => cart.id === cartId);

    if (!cart) {
      throw new Error('Carrito no encontrado.');
    }

    return cart;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = this.getCartById(cartId);

    const existingProductIndex = cart.products.findIndex((item) => item.product === productId);

    if (existingProductIndex !== -1) {
      // Si el producto ya existe en el carrito, incrementar la cantidad
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Si el producto no existe en el carrito, agregarlo
      cart.products.push({
        product: productId,
        quantity,
      });
    }

    // Guardar carritos actualizados en el archivo
    await this.saveCarts();

    // Devolver el producto recién agregado o actualizado
    return cart.products.find((item) => item.product === productId);
  }
}

module.exports = CartManager;
