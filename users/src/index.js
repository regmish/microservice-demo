import express from 'express';

const PORT = process.env.PORT || 3030;

const app = express();

app.get('/', (_, res) => res.json({ message: 'Users API up and running' }));

app.listen(PORT, () => console.log(`Users API listening on ${PORT}`));
