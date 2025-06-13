const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  descripcion: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Caballeros', 'Damas', 'Unisex']
  },
  imagen: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  destacado: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
