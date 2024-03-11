export const query_offspring_by_ids_relation = (idsRelationString: string): string => {
    return `select relations_offspring.*,users.name
            from relations_offspring, relations, users
            where relations_offspring.idRelation = relations.id
            AND relations_offspring.idUser = users.id
            and relations.id in(${idsRelationString})`;
};