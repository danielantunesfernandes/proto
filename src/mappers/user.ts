import { User, Relation } from "../interfaces";

const mapRowToUser = (row: any): User => {
    return {
        id: row.id,
        name: row.name,
        relation: {
            id: row.relId,
            relType: row.relType,
            user: {
                id: row.idRel,
                name: row.nameRelUser
            }
        } as Relation
    } as User;
};
export const mapRowsToUsers = (rows: any[]): User[] => {
    return rows.map(mapRowToUser);
};