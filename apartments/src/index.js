import express from 'express';

const PORT = process.env.PORT || 3030;

const app = express();

app.get('/', (_, res) => res.json({ message: 'Apartments API up and running' }));

app.listen(PORT, () => console.log(`Apartments API listening on ${PORT}`));
