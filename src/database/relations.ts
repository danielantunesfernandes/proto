import sqlite3 from 'sqlite3';
import { RelationOffspring } from '../interfaces/relation';
import { query_offspring_by_ids_relation } from './queries/relations';
import { mapRowsToRelationOffspringByRelationId } from '../mappers/relations';

const db = new sqlite3.Database('./database/proto.db');

export const getRelationsOffspringByRelationId = (idsRelation: number[]): Promise<Map<number, RelationOffspring[]>> => {
    const idsRelationString: string = idsRelation.join(',');
    const query = query_offspring_by_ids_relation(idsRelationString);
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows: any[]) => {
            if (err) {
                reject(err);
            } else {
                console.log(rows);
                resolve(
                    mapRowsToRelationOffspringByRelationId(rows)
                );
            }
        });
    });
};