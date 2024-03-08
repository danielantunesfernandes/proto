import { User, Relation } from "../interfaces";
import { BirthLocation } from "../interfaces/location";

const mapRowToUser = (row: any): User => {
    const user: User = {
        id: row.id,
        name: row.name,
        birthLocation: {
            id: row.birthLocId,
            districtId: row.birthLocDistrictId,
            municipalityId: row.birthLocMunicipalityId,
            parishId: row.birthLocParishId,
            villageId: row.birthLocVillageId,
        } as BirthLocation,
    } as User;

    if (row.relId) {
        user.relation = {
            id: row.relId,
            relType: row.relType,
            user: {
                id: row.idRel,
                name: row.nameRelUser
            }
        } as Relation;
    }
    return user;
};
export const mapRowsToUsers = (rows: any[]): User[] => {
    return rows.map(mapRowToUser);
};