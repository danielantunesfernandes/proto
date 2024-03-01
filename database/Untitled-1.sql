

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



-- drop TABLE cat_loc_districts;
-- drop TABLE cat_loc_municipalities;
-- drop TABLE cat_loc_parishes;
-- drop TABLE cat_loc_villages;

CREATE TABLE cat_loc_districts (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE cat_loc_municipalities (id INTEGER PRIMARY KEY, name TEXT,idDistrict INTEGER NOT NULL,FOREIGN KEY (idDistrict) REFERENCES districts(id) );
CREATE TABLE cat_loc_parishes (id INTEGER PRIMARY KEY, name TEXT,idMunicipality INTEGER NOT NULL,FOREIGN KEY (idMunicipality) REFERENCES municipalities(id) );
CREATE TABLE cat_loc_villages (id INTEGER PRIMARY KEY, name TEXT,idParish INTEGER NOT NULL,FOREIGN KEY (idParish) REFERENCES parishes(id));

insert into cat_loc_districts (name) values ('Coimbra');
insert into cat_loc_municipalities (name,idDistrict) values ('Miranda do Corvo',1);
insert into cat_loc_parishes (name,idMunicipality) values ('Vila Nova',1);
insert into cat_loc_villages (name,idParish) values ('Barbens',1);
insert into cat_loc_villages (name,idParish) values ('Souravas',1);
insert into cat_loc_villages (name,idParish) values ('Besteiros',1);

select * from cat_loc_villages;
CREATE TABLE user_birthday_location (
 id INTEGER PRIMARY KEY,
 idDistrict INTEGER NOT NULL,
 idParish INTEGER NOT NULL,
 idVillage INTEGER NOT NULL,
 idMunicipality INTEGER NOT NULL,
 FOREIGN KEY (idDistrict) REFERENCES cat_loc_districts(id),
 FOREIGN KEY (idParish) REFERENCES cat_loc_municipalities(id),
 FOREIGN KEY (idVillage) REFERENCES paricat_loc_parishesshes(id),
 FOREIGN KEY (idMunicipality) REFERENCES cat_loc_villages(id)
 );

insert into user_birthday_location (idDistrict,idParish,idVillage,idMunicipality) values (1,1,1,1);
select * from user_birthday_location;
PRAGMA table_info(user_birthday_location);

ALTER TABLE users rename to users_temp;
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT,birthdayLocationId INTEGER, FOREIGN KEY (birthdayLocationId) REFERENCES user_birthday_location(id));
INSERT into users (name,birthdayLocationId) values ('Maria',1);
INSERT into users (name,birthdayLocationId) values ('Manuel',1);

select * from users;
select * from relations;
update relations set idRelB=2


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
    -- and bloc.id = u.id
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