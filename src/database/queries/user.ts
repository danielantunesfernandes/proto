export const GET_USERS_FULL_INFO = `
SELECT u.id id,
    u.name name,
    tabRelByUser.relId relId,
    tabRelByUser.idRel as idRel,
    usersRelations.name nameRelUser,
    catRelations.name,
    bLoc.id birthLocId,
    bLoc.idDistrict birthLocDistrictId,
    bLoc.idMunicipality birthLocMunicipalityId,
    bLoc.idParish birthLocParishId,
    bLoc.idVillage birthLocVillageId
from users u,(
    select u.id,r.id as relId,r.idRelB as idRel , r.idCat cat
    from users u,relations r
    where u.id = r.idRelA
    UNION
    select  u.id,r.id as relId,r.idRelA as idRel , r.idCat cat
    from users u,relations r
    where u.id = r.idRelB) as tabRelByUser,
    users as usersRelations,
    catRelations,
    user_birthday_location bLoc
where u.id = tabRelByUser.id
    and usersRelations.id= tabRelByUser.idRel
    and tabRelByUser.cat= catRelations.id
    and bloc.id = u.id
UNION
SELECT u.id id,u.name name, NULL,NULL, NULL, NULL,   
    bLoc.id birthLocId,
    bLoc.idDistrict birthLocDistrictId,
    bLoc.idMunicipality birthLocMunicipalityId,
    bLoc.idParish birthLocParishId,
    bLoc.idVillage birthLocVillageId
FROM users u, relations r, user_birthday_location bLoc
WHERE (u.id != r.idRelA and u.id != r.idRelB)
    and bloc.id = u.id
    `;

export const GET_USERS = 'SELECT * FROM users';