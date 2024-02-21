

select users.id, users.name, tabRelByUser.relId person_rel_id, usersRelations.name person_rel_name, tabRelByUser.cat, catRelations.name cat_name
from users,(
    select u.id,r.id as relId,r.idRelB as idRel , r.idCat cat
    from users u,relations r
    where u.id = r.idRelA
    UNION
    select  u.id,r.id as relId,r.idRelA as idRel , r.idCat cat
    from users u,relations r
    where u.id = r.idRelB) as tabRelByUser,
    users as usersRelations, 
    catRelations 
where users.id = tabRelByUser.id
    and usersRelations.id= tabRelByUser.idRel
    and tabRelByUser.idCat= catRelations.id

SELECT u.id id,u.name name, tabRelByUser.relId relId,tabRelByUser.idRel as idRel, usersRelations.name nameRelUser, catRelations.name
from users u,(
    select u.id,r.id as relId,r.idRelB as idRel , r.idCat cat
    from users u,relations r
    where u.id = r.idRelA
    UNION
    select  u.id,r.id as relId,r.idRelA as idRel , r.idCat cat
    from users u,relations r
    where u.id = r.idRelB) as tabRelByUser,
    users as usersRelations,
    catRelations
where u.id = tabRelByUser.id
    and usersRelations.id= tabRelByUser.idRel
    and tabRelByUser.cat= catRelations.id
UNION
SELECT u.id id,u.name name, NULL,NULL, NULL, NULL
FROM users u, relations r
WHERE u.id != r.idRelA and u.id != r.idRelB

