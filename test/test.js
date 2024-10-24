// test/server.test.js
const request = require('supertest');
const app = require('../server'); // Assurez-vous que le chemin est correct

describe('Vérification du Serveur', () => {
    it('devrait répondre avec un statut 200 pour la route principale', async () => {
        const response = await request(app).get('/'); // Envoie une requête GET à la racine
        expect(response.statusCode).toBe(200); // Vérifie que le statut est 200
    });
});
