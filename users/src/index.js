import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3030;

const app = express();

app.use(cors());

app.get('/', (_, res) => res.json({ message: 'Users API up and running.' }));

app.listen(PORT, () => console.log(`Users API listening on ${PORT}`));
