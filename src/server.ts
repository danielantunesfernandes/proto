import express from 'express';
import apiRoutes from './routes/api-routes';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
