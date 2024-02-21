import { Relation } from "./relation";

export interface User {
    id: number;
    name: string,
    relation?: Relation
};