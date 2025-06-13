const mercadopago = require('mercadopago');
const Order = require('../models/Order');

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

exports.createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('items.producto');
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    const items = order.items.map(item => ({
      title: item.producto.nombre,
      unit_price: item.precioUnitario,
      quantity: item.cantidad,
      picture_url: item.producto.imagen
    }));
    
    const preference = {
      items,
      external_reference: orderId.toString(),
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL}/pago-pendiente`
      },
      auto_return: 'approved',
      notification_url: `${process.env.API_URL}/api/payments/webhook`
    };
    
    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.webhook = async (req, res) => {
  try {
    const { id, topic } = req.query;
    
    if (topic === 'payment') {
      const payment = await mercadopago.payment.findById(id);
      const orderId = payment.body.external_reference;
      
      if (payment.body.status === 'approved') {
        await Order.findByIdAndUpdate(orderId, { estado: 'completado' });
      }
    }
    
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
