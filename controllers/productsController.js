const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Público
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search } = req.query;
    let query = {};
    
    if (category && category !== 'all') {
      query.categoria = category;
    }
    
    if (featured === 'true') {
      query.destacado = true;
    }
    
    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Crear un producto
// @route   POST /api/products
// @access  Privado/Admin
exports.createProduct = async (req, res) => {
  try {
    const { nombre, codigo, precio, descripcion, categoria, stock } = req.body;
    
    const product = new Product({
      nombre,
      codigo,
      precio,
      descripcion,
      categoria,
      stock,
      imagen: req.file ? `/uploads/${req.file.filename}` : ''
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
