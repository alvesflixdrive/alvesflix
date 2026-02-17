const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 80;
const DATA_FILE = path.join(__dirname, 'data', 'library.json');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Garante que o arquivo de dados existe
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

// --- API Endpoints ---

// 1. Ler biblioteca
app.get('/api/library', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Erro ao ler dados' });
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.json([]);
        }
    });
});

// 2. Salvar biblioteca (Sobrescreve o arquivo com a nova lista)
app.post('/api/library', (req, res) => {
    const newLibrary = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newLibrary, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao salvar dados' });
        res.json({ success: true });
    });
});

// Serve o Frontend para qualquer outra rota (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`AlvesFlix Server rodando na porta ${PORT}`);
});