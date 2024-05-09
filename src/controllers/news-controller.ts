import { Request, Response } from 'express';
import { NewsFilter, NewsItem, getNewsByFilter } from "../database/news";

export class NewsController {
    constructor() { };
    async getNews(req: Request, res: Response): Promise<void> {
        try {
            const filter: NewsFilter = {};
            if (req.query.sourceId) {
                filter.sourceId = req.query.sourceId as string;
            }
            if (req.query.limit && req.query.offset) {
                filter.pagination = {
                    limit: req.query.limit as string,
                    offset: req.query.offset as string
                };
            }
            const news: NewsItem[] = await getNewsByFilter(filter);
            res.json(news);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}   