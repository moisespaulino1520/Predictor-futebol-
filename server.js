const express = require('express');
const axios = require('axios');
const { calculateProbability } = require('./utils/math');
const app = express();

const API_KEY = '5e51c97697msha837de25cc6a258p1a4b9ejsn2fba20317a74'; 
const HEADERS = { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': 'v3.football.api-sports.io' };

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        const teamId = 33; // Manchester United (Podes mudar o ID depois)
        const response = await axios.get(`https://v3.football.api-sports.io/fixtures?team=${teamId}&last=5`, { headers: HEADERS });
        
        let statsSum = { corners: 0, cards: 0, offsides: 0 };
        let games = [];

        for (const match of response.data.response) {
            const fId = match.fixture.id;
            const sRes = await axios.get(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${fId}&team=${teamId}`, { headers: HEADERS });
            
            const findStat = (type) => sRes.data.response[0]?.statistics.find(s => s.type === type)?.value || 0;
            
            const gameData = {
                date: match.fixture.date.split('T')[0],
                corners: parseInt(findStat('Corner Kicks')),
                cards: parseInt(findStat('Yellow Cards')),
                offsides: parseInt(findStat('Offsides'))
            };
            
            statsSum.corners += gameData.corners;
            statsSum.cards += gameData.cards;
            statsSum.offsides += gameData.offsides;
            games.push(gameData);
        }

        const averages = { corners: statsSum.corners / 5, cards: statsSum.cards / 5 };
        const predictions = {
            moreThan8Corners: calculateProbability(averages.corners, 8),
            moreThan3Cards: calculateProbability(averages.cards, 3)
        };

        res.render('index', { games, predictions, teamName: "Manchester United" });
    } catch (err) { res.send("Erro: Liga a tua API Key primeiro no server.js"); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor Online!'));
