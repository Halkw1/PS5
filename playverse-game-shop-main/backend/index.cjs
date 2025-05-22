require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mercadopago = require('mercadopago');
const knex = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY || 'secret_jwt_key';

// Configura token Mercado Pago
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

app.use(cors());
app.use(express.json());

// Criação das tabelas
async function createTables() {
  const usersExists = await knex.schema.hasTable('users');
  if (!usersExists) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').unique();
      table.string('name');
      table.string('password');
      table.boolean('isAdmin').defaultTo(false);
    });
    console.log("Tabela 'users' criada.");
  }

  const ordersExists = await knex.schema.hasTable('orders');
  if (!ordersExists) {
    await knex.schema.createTable('orders', (table) => {
      table.increments('id').primary();
      table.string('external_reference').unique();
      table.float('amount');
      table.string('status');
      table.timestamps(true, true);
    });
    console.log("Tabela 'orders' criada.");
  }
}

createTables();

// Registro
app.post('/register', async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const existingUser = await knex('users').where({ email }).first();
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await knex('users').insert({
      email,
      name,
      password: hashedPassword,
      isAdmin: false,
    });

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await knex('users').where({ email }).first();
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Criar pagamento PIX
app.post('/create_payment_pix', async (req, res) => {
  const { amount, description, email, external_reference } = req.body;
  try {
    const payment_data = {
      transaction_amount: amount,
      description,
      payment_method_id: 'pix',
      payer: { email: email || 'test_user@example.com' },
      external_reference,
    };

    const response = await mercadopago.payment.create(payment_data);

    if (response.body.status === 'pending') {
      await knex('orders').insert({
        external_reference,
        amount,
        status: 'pending',
      });

      res.json({
        qr_code: response.body.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: response.body.point_of_interaction.transaction_data.qr_code_base64,
        id: response.body.id,
      });
    } else {
      res.status(400).json({ message: 'Erro ao criar pagamento PIX' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Webhook Mercado Pago
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

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
