// src/database.ts
import sqlite3 from 'sqlite3';
import { Item, ScrapResult } from '../controllers/scrap-controller';

// Create SQLite database instance
const db = new sqlite3.Database('./database/scrap.db');


/**
 * tables:
 *  sources
 * CREATE TABLE sources (id INTEGER PRIMARY KEY, source TEXT unique);

 * sections
 *  CREATE TABLE sections (id INTEGER PRIMARY KEY, title TEXT unique);
 *  
 *  drop table news;
drop table positionHistory;
CREATE TABLE positionHistory (id INTEGER PRIMARY KEY, position INTEGER, date DATETIME,newsId INTEGER, FOREIGN KEY (newsId) REFERENCES news(id));
CREATE TABLE news (id INTEGER PRIMARY KEY, title TEXT, url TEXT unique,idSource INTEGER,idSections INTEGER, FOREIGN KEY (idSections) REFERENCES sections(id));
 * */


const getSourceId = async (source: string): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        db.run('INSERT OR IGNORE INTO sources (source) VALUES (?)', [source], async function (err) {
            if (err) {
                reject(err);
            } else {
                let sourceId = 0;
                if (this.changes > 0) {
                    console.log("source inserted");
                    sourceId = this.lastID;
                } else {
                    console.log("source not inserted");
                    sourceId = await new Promise<number>((resolve, reject) => {
                        db.get('SELECT id FROM sources WHERE source = ?', [source], (err, row: any) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(row.id);
                            }
                        });
                    });
                }
                resolve(sourceId);
            }
        });
    });
};

const getSectionId = async (section: string): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        db.run('INSERT OR IGNORE INTO sections (title) VALUES (?)', [section], async function (err) {
            if (err) {
                reject(err);
            } else {
                let sectionId = 0;
                if (this.changes > 0) {
                    console.log("section inserted");
                    sectionId = this.lastID;
                } else {
                    console.log("section not inserted");
                    sectionId = await new Promise<number>((resolve, reject) => {
                        db.get('SELECT id FROM sections WHERE title = ?', [section], (err, row: any) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(row.id);
                            }
                        });
                    });
                }
                resolve(sectionId);
            }
        });
    });
};

type GetLastPositionByNewResponse = {
    position: number;
    newsId: number;
}
const getLastPositionByNew = async (item: Item): Promise<GetLastPositionByNewResponse | undefined> => {
    return await new Promise<GetLastPositionByNewResponse | undefined>((resolve, reject) => {
        db.get('SELECT positionHistory.position as position, news.id as newsId FROM positionHistory, news  WHERE positionHistory.newsId = news.id  and news.title = ? ORDER BY date DESC LIMIT 1', [item.title], (err, row: any) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    resolve({ position: row.position, newsId: row.newsId });
                } else {
                    resolve(undefined);
                }

            }
        });
    });
}

const insertPositionHistory = async (item: Item, id: number): Promise<void> => {
    await new Promise<void>((resolve, reject) => {
        db.get('INSERT OR IGNORE INTO positionHistory (position,date,newsId) VALUES (?,?,?)', [item.position, new Date(), id], (err, row: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
export const addScrapResult = (result: ScrapResult[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        result.forEach(async (resultItem: ScrapResult) => {
            const sourceId = await getSourceId(resultItem.source);
            console.log(sourceId);
            resultItem.items.forEach(async (section) => {
                const sectionId = await getSectionId(section.title);
                section.items.forEach(async (item) => {
                    await db.run('INSERT OR IGNORE INTO news (title,url,idSource,idSections) VALUES (?,?,?,?)', [item.title, item.url, sourceId, sectionId], async function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            if (this.changes > 0) {
                                console.log("news inserted");
                                await insertPositionHistory(item, this.lastID);
                            } else {
                                const lastPositionReg: GetLastPositionByNewResponse | undefined = await getLastPositionByNew(item);
                                if (lastPositionReg && lastPositionReg.position !== item.position) {
                                    await insertPositionHistory(item, lastPositionReg.newsId);
                                }
                            }
                            resolve();
                        }
                    });
                });
            });
        });
    });
};




