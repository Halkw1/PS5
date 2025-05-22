require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mercadopagoImport = require('mercadopago');
const mercadopago = mercadopagoImport.default || mercadopagoImport;

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const knex = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY || 'secret_jwt_key';

mercadopago.configurations = {
  access_token: process.env.MP_ACCESS_TOKEN,
};

app.use(cors());
app.use(express.json());

// Rota para criar pagamento PIX
app.post('/create_payment_pix', async (req, res) => {
  const { amount, description, email, external_reference } = req.body;

  const payment_data = {
    transaction_amount: amount,
    description,
    payment_method_id: 'pix',
    payer: {
      email: email || 'test_user@example.com',
    },
    external_reference,
  };

  try {
    const response = await mercadopago.payment.create(payment_data);

    if (response.body.status === 'pending') {
      await knex('orders').insert({
        external_reference,
        amount,
        status: 'pending',
      });

      return res.json({
        qr_code: response.body.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: response.body.point_of_interaction.transaction_data.qr_code_base64,
        id: response.body.id,
      });
    }

    return res.status(400).json({ message: 'Erro ao criar pagamento PIX' });
  } catch (error) {
    console.error('Erro no pagamento PIX:', error);
    return res.status(500).json({ message: 'Erro interno ao processar pagamento' });
  }
});

// Webhook (exemplo para pegar pagamento por id)
app.post('/webhook', async (req, res) => {
  const topic = req.query.topic || req.body.type;
  const id = req.query.id || req.body.data?.id;

  if (topic === 'payment' && id) {
    try {
      const payment = await mercadopago.payment.findById(id);
      if (payment.body.status === 'approved') {
        await knex('orders')
          .where({ external_reference: payment.body.external_reference })
          .update({ status: 'paid' });
        console.log(`Pedido ${payment.body.external_reference} pago.`);
      }
    } catch (error) {
      console.error('Erro no webhook:', error);
    }
  }

  res.sendStatus(200);
});
// Rota para consultar status do pedido pelo external_reference
app.get('/orders/status/:external_reference', async (req, res) => {
  const { external_reference } = req.params;

  try {
    const order = await knex('orders')
      .where({ external_reference })
      .first();

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    return res.json({ status: order.status });
  } catch (error) {
    console.error('Erro ao buscar status do pedido:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
});


app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
