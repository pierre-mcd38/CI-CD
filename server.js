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
        // Appeler l'API pour obtenir les taux de conversion
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from_currency}`);
        
        // Vérifier si l'API a renvoyé les taux de conversion
        if (response.data && response.data.conversion_rates) {
            const rate = response.data.conversion_rates[to_currency];

            // Vérifier que le taux existe avant de faire la conversion
            if (rate) {
                // Calculer le montant converti
                const result = (amount * rate).toFixed(2);
                // Rendre la vue avec le résultat
                return res.render('index', { result, to_currency });
            } else {
                return res.render('index', { result: 'Erreur : Devise non disponible.', to_currency });
            }
        } else {
            return res.render('index', { result: 'Erreur : Réponse API invalide.', to_currency });
        }
    } catch (error) {
        console.error(error);
        return res.render('index', { result: 'Erreur lors de la conversion des devises.', to_currency });
    }
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
