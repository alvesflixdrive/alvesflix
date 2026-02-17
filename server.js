const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 80;
const DATA_DIR = path.join(__dirname, 'data');
const LIBRARY_FILE = path.join(DATA_DIR, 'library.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Garante que a pasta e arquivos existem
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(LIBRARY_FILE)) {
    fs.writeFileSync(LIBRARY_FILE, '[]');
}
if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, '{}');
}

// --- API Endpoints ---

// 1. Biblioteca (Filmes/Séries)
app.get('/api/library', (req, res) => {
    fs.readFile(LIBRARY_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Erro ler library' });
        try { res.json(JSON.parse(data)); } catch (e) { res.json([]); }
    });
});

app.post('/api/library', (req, res) => {
    fs.writeFile(LIBRARY_FILE, JSON.stringify(req.body, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Erro salvar library' });
        res.json({ success: true });
    });
});

// 2. Histórico (Continuar Assistindo) - NOVO!
app.get('/api/history', (req, res) => {
    fs.readFile(HISTORY_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Erro ler history' });
        try { res.json(JSON.parse(data)); } catch (e) { res.json({}); }
    });
});

app.post('/api/history', (req, res) => {
    // Salva o histórico enviado pelo frontend
    fs.writeFile(HISTORY_FILE, JSON.stringify(req.body, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Erro salvar history' });
        res.json({ success: true });
    });
});

// Serve o Frontend (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`AlvesFlix Server rodando na porta ${PORT}`);
});