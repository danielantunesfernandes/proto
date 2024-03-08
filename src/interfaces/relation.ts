import { User } from "./user";

export interface Relation {
    id: number;
    user: User;
    relType: string;
    relationsOffspring?: RelationOffspring[];
};

export interface RelationOffspring {
    id: number;
    user: User;
};


