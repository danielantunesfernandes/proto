import { RelationOffspring, User } from "../interfaces";

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

export const mapOffspringRelationsToUsers = (offspringRelations: Map<number, RelationOffspring[]>, users: User[]) => {
    offspringRelations.forEach((offspringRelation, key) => {
        users.forEach((user) => {
            if (user.relation && user.relation.id === key) {
                user.relation.relationsOffspring = user.relation.relationsOffspring || [];
                user.relation.relationsOffspring.push(...offspringRelation);
            }
        });
    });
}