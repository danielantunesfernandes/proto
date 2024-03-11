// src/database.ts
import sqlite3 from 'sqlite3';
import { RelationOffspring, User } from '../interfaces';
import { mapRowsToUsers } from '../mappers/user';
import { GET_USERS, GET_USERS_FULL_INFO } from './queries/user';
import { getRelationsOffspringByRelationId } from './relations';
import { mapOffspringRelationsToUsers } from '../mappers/relations';

// Create SQLite database instance
const db = new sqlite3.Database('./database/proto.db');

// Tables schema
// CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
// CREATE TABLE catRelations (id INTEGER PRIMARY KEY, name TEXT);
// insert into catRelations (name) values ('married');
//insert into catRelations (name) values ('divorced');ß
// CREATE TABLE relations (id INTEGER PRIMARY KEY,idCat INTEGER, idRelA INTEGER ,idRelB INTEGER, FOREIGN KEY (idRelA) REFERENCES users(id), FOREIGN KEY (idRelB) REFERENCES users(id), FOREIGN KEY (idCat) REFERENCES catRelations(id));

export const addUser = (name: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (name) VALUES (?)', [name], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

export const getUsers = (fullInfo?: boolean): Promise<User[]> => {
    let query = GET_USERS;
    if (fullInfo) {
        query = GET_USERS_FULL_INFO;
    }
    return new Promise((resolve, reject) => {
        db.all(query, async (err, rows: any[]) => {
            if (err) {
                reject(err);
            } else {
                const users: User[] = mapRowsToUsers(rows);
                const idRelations: number[] = users.filter((user) => user.relation && user.relation.id).map((user) => user.relation!.id);
                if (idRelations.length > 0) {
                    let uniqueRelationIdsArray = [...new Set(idRelations)];//clear duplicates
                    const offspringRelations: Map<number, RelationOffspring[]> = await getRelationsOffspringByRelationId(uniqueRelationIdsArray);
                    mapOffspringRelationsToUsers(offspringRelations, users);
                }
                resolve(users);
            }
        });
    });
};

export const updateUser = (id: number, newName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE users SET name = ? WHERE id = ?', [newName, id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const updateUsers = () => { }
export const deleteUser = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
