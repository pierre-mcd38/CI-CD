const axios = require('axios');
jest.mock('axios');  // Cela permet de simuler les appels API dans les tests

// Fonction à tester - ici je suppose que vous avez une fonction de conversion
async function convertirDevise(amount, from_currency, to_currency) {
    const API_KEY = '38f21d31c78830184e2055e3';
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from_currency}`);

    if (response.data && response.data.conversion_rates) {
        const rate = response.data.conversion_rates[to_currency];
        if (rate) {
            return (amount * rate).toFixed(2);  // On renvoie la conversion arrondie
        } else {
            throw new Error('Devise non disponible');
        }
    } else {
        throw new Error('Erreur lors de la conversion des devises');
    }
}

// Test unitaire
describe('convertirDevise', () => {
    it('devrait correctement convertir une devise', async () => {
        // Simuler une réponse API avec un taux de conversion fictif
        axios.get.mockResolvedValueOnce({
            data: {
                conversion_rates: {
                    EUR: 0.85,  // Exemple: 1 USD = 0.85 EUR
                },
            },
        });

        const amount = 100;  // Montant à convertir
        const from_currency = 'USD';
        const to_currency = 'EUR';

        // Effectuer la conversion
        const result = await convertirDevise(amount, from_currency, to_currency);

        // Vérifier que le résultat est correct
        expect(result).toBe('85.00');  // 100 USD * 0.85 = 85.00 EUR
    });
});
