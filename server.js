const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configurado para aceitar frontend da Vercel
const corsOptions = {
  origin: [
    "https://recados-frontend.vercel.app",
    // "https://SEU-CODESPACE-5000.app.github.dev"  <- descomente quando for testar no Codespaces
  ],
  methods: "GET,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization"
};

app.use(cors(corsOptions));

// Banco de dados fictício
let recados = [
  {
    id: 1,
    mensagem: "Estudar CI/CD hoje",
    autor: "Miguel",
    data: "2026-05-13"
  },
  {
    id: 2,
    mensagem: "Finalizar atividade do professor",
    autor: "Aluno",
    data: "2026-05-13"
  }
];

// GET: listar todos os recados
app.get("/recados", (req, res) => {
  res.json({
    mensagem: "Recados carregados",
    total: recados.length,
    recados: recados
  });
});

// GET: recado por ID
app.get("/recados/:id", (req, res) => {
  const recado = recados.find(r => r.id == req.params.id);

  if (!recado) {
    return res.status(404).json({
      erro: "Recado não encontrado"
    });
  }

  res.json(recado);
});

// POST: criar recado
app.post("/recados", (req, res) => {
  const { mensagem, autor } = req.body;

  if (!mensagem || !autor) {
    return res.status(400).json({
      erro: "Mensagem e autor obrigatórios"
    });
  }

  const novoRecado = {
    id: recados.length > 0
      ? Math.max(...recados.map(r => r.id)) + 1
      : 1,
    mensagem,
    autor,
    data: new Date().toLocaleDateString("pt-BR"),
    hora: new Date().toLocaleTimeString("pt-BR")
  };

  recados.push(novoRecado);

  res.status(201).json({
    mensagem: "Recado criado",
    recado: novoRecado
  });
});

// DELETE: remover recado
app.delete("/recados/:id", (req, res) => {
  const id = Number(req.params.id);

  const existe = recados.find(r => r.id === id);

  if (!existe) {
    return res.status(404).json({
      erro: "Recado não encontrado"
    });
  }

  recados = recados.filter(r => r.id !== id);

  res.json({
    mensagem: "Recado removido com sucesso"
  });
});

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "Backend do Sistema de Recados rodando",
    versao: "1.0.0",
    cors_ativo: true,
    total_recados: recados.length
  });
});

// Rota v1
app.get("/v1", (req, res) => {
  const agora = new Date().toLocaleString("pt-BR");
  res.json({
    message: "Api v1 respondendo no container docker...",
    chamada_em: agora
  });
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
  console.log(`CORS habilitado para: ${corsOptions.origin}`);
});