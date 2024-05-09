import sqlite3 from 'sqlite3';
import {
    QUERY_GET_NEWS,
    QUERY_GET_PAGINATION_CONDITION,
    QUERY_GET_SOURCE_CONDITION
} from './queries/news';
const db = new sqlite3.Database('./database/scrap.db');

export type NewsItem = {
    title: string;
    url: string;
    source: {
        id: number;
        source: string;
    };
    section: {
        id: number;
        title: string;
    };
    id: number;
};
export type NewsFilter = {
    sourceId?: string;
    pagination?: {
        limit: string;
        offset: string;
    };
};

function handleQueryAndFilter(filter: NewsFilter): { params: string[], query: string } {
    const params: string[] = [];
    let query = QUERY_GET_NEWS;

    if (filter) {
        if (filter.sourceId) {
            query = query.concat(QUERY_GET_SOURCE_CONDITION);
            params.push(filter.sourceId);
        }
        if (filter.pagination) {
            query = query.concat(QUERY_GET_PAGINATION_CONDITION)
            params.push(filter.pagination.limit, filter.pagination.offset);
        }
    }
    return { params, query };
}


export const getNewsByFilter = async (filter: NewsFilter): Promise<NewsItem[]> => {
    return new Promise<NewsItem[]>((resolve, reject) => {

        const { params, query } = handleQueryAndFilter(filter);

        db.all(query, params, (err: any, rows: any[]) => {
            if (err) {
                reject(err);
            } else {
                let news: NewsItem[] = [];

                if (rows) {
                    news = rows.map((row) => {
                        return {
                            id: row.id,
                            title: row.title,
                            url: row.url,
                            source: {
                                id: row.sourceId,
                                source: row.sourceName
                            },
                            section: {
                                id: row.sectionId,
                                title: row.secTitle
                            },
                        };
                    });
                }
                resolve(news);
            }
        });
    });
};


