export const QUERY_GET_NEWS = `select n.id,n.title,n.url, s.source as sourceName, s.id as sourceId, sec.id as sectionId, sec.title as secTitle 
                               from news n,sources s, sections sec 
                               where n.idSource = s.id and sec.id=idSections`;
export const QUERY_GET_PAGINATION_CONDITION = 'LIMIT ? OFFSET ? ';
export const QUERY_GET_SOURCE_CONDITION = '\n and s.id = ?';