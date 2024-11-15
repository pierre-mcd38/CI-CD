// server.js
const express = require('express');
const axios = require('axios');
const app = express();

// Clé API pour ExchangeRate-API (remplacez par votre clé API)
const API_KEY = '38f21d31c78830184e2055e3';

// Configurer le moteur de template EJS
app.set('view engine', 'ejs');

// Middleware pour gérer les données des formulaires
app.use(express.urlencoded({ extended: true }));

// Route principale pour afficher le formulaire
app.get('/', (req, res) => {
    res.render('index', { result: null });
});

// Route POST pour gérer la conversion des devises
app.post('/convert', async (req, res) => {
    const { amount, from_currency, to_currency } = req.body;

    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from_currency}`);

        if (response.data && response.data.conversion_rates) {
            const rate = response.data.conversion_rates[to_currency];

            if (rate) {
                const result = (amount * rate).toFixed(2);
                return res.render('index', { result, from_currency, to_currency, amount });
            } else {
                return res.render('index', { result: 'Erreur : Devise non disponible.', from_currency, to_currency, amount });
            }
        } else {
            return res.render('index', { result: 'Erreur : Réponse API invalide.', from_currency, to_currency, amount });
        }
    } catch (error) {
        console.error(error);
        return res.render('index', { result: 'Erreur lors de la conversion des devises.', from_currency, to_currency, amount });
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// Exporter l'application pour les tests
module.exports = server;
