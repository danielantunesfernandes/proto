import express from 'express';
import apiRoutes from './routes/api-routes';
import routerScrap from './routes/scrap-api-routes';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', apiRoutes);
app.use('/scrap', routerScrap);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
