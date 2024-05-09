-- -- SQLite
-- SELECT *
-- FROM news,sources
-- WHERE idSource = sources.id and lastPosition!= position;

-- CREATE TABLE positionHistory (id INTEGER PRIMARY KEY, position INTEGER, date DATETIME);

-- drop table news;
-- drop table positionHistory;
-- CREATE TABLE positionHistory (id INTEGER PRIMARY KEY, position INTEGER, date DATETIME,newsId INTEGER, FOREIGN KEY (newsId) REFERENCES news(id));
-- CREATE TABLE news (id INTEGER PRIMARY KEY, title TEXT, url TEXT unique,idSource INTEGER,idSections INTEGER, FOREIGN KEY (idSections) REFERENCES sections(id));

-- select * from news;


select newsId,count(*) from positionHistory group by newsId HAVING count(*)>1;
SELECT * FROM positionHistory where newsId=1;

update positionHistory set position=1 where newsId=1;

select p.*,idSource from positionHistory p,news where news.id=p.newsId AND idSource!=1 order by newsId;



select sections.id,count(*)
from news,sources, positionHistory,sections 
where idSource = sources.id 
and sections.id=news.idSections
and news.id=positionHistory.newsId 
group by sections.id 

select * from sections;


select n.id,n.title,n.url, s.source, s.id,sec.id from news n,sources s,sections sec where n.idSource = s.id  and n.idSections=sec.id;



select n.id,n.title,n.url, s.source as sourceName, s.id as sourceId, sec.id as sectionId, sec.title as secTitle 
                               from news n,sources s, sections sec 
                               where n.idSource = s.id and sec.id=idSections
                               LIMIT 10 OFFSET 30