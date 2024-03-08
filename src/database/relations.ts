import sqlite3 from 'sqlite3';
import { RelationOffspring } from '../interfaces/relation';



const db = new sqlite3.Database('./database/proto.db');

const mapRowToRelationOffspring = (row: any): RelationOffspring => {
    return {
        id: row.id,
        user: {
            id: row.idUser,
            name: row.name
        }
    } as RelationOffspring;
};

export const mapRowsToRelationOffspring = (rows: any[]): RelationOffspring[] => {
    return rows.map(mapRowToRelationOffspring);
};

export const mapRowsToRelationOffspringByRelationId = (rows: any[]): Map<number, RelationOffspring[]> => {
    const offSpringByRelations = new Map<number, RelationOffspring[]>();
    rows.forEach((row) => {
        const relationId = row.idRelation;
        const offspring = mapRowToRelationOffspring(row);
        if (offSpringByRelations.has(relationId)) {
            offSpringByRelations.get(relationId)?.push(offspring);
        } else {
            offSpringByRelations.set(relationId, [offspring]);
        }
    });

    return offSpringByRelations;
};


export const getRelationsOffspringByRelationId = (idsRelation: number[]): Promise<Map<number, RelationOffspring[]>> => {
    const idsRelationString: string = idsRelation.join(',');
    const query = `
    select relations_offspring.*,users.name
    from relations_offspring, relations, users
    where relations_offspring.idRelation = relations.id
    AND relations_offspring.idUser = users.id
    and relations.id in(${idsRelationString})`;
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