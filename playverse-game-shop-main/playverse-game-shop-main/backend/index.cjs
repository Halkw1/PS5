const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'sua_chave_secreta_aqui';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// "Banco" simples em arquivo JSON
const USERS_FILE = './users.json';

// Função para ler usuários
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
}

// Função para salvar usuários
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Rota cadastro
app.post('/register', async (req, res) => {
  const { email, name, password } = req.body;
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), email, name, password: hashedPassword };
  users.push(newUser);
  saveUsers(users);

  res.json({ message: 'User registered successfully' });
});

// Rota login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
