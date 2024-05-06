// src/routes/apiRoutes.ts
import express, { Router, Request, Response } from 'express';
import { ScrapController } from '../controllers/scrap-controller';

// Create an Express router
const routerScrap: Router = express.Router();

const scrapController: ScrapController = new ScrapController();
routerScrap.get('/', scrapController.scrapWebPage);
routerScrap.get('/scrap', scrapController.scrapWebPage);
export default routerScrap;