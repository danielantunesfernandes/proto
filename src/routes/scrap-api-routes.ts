// src/routes/apiRoutes.ts
import express, { Router, Request, Response } from 'express';
import { ScrapController } from '../controllers/scrap-controller';
import { NewsController } from '../controllers/news-controller';

// Create an Express router
const routerScrap: Router = express.Router();

const scrapController: ScrapController = new ScrapController();
const newsController: NewsController = new NewsController();
routerScrap.get('/news', newsController.getNews);
routerScrap.get('/scrap', scrapController.scrapWebPage);
export default routerScrap;