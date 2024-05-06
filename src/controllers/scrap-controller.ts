import axios, { AxiosError, AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import { addScrapResult } from '../database/scraper';

export type Item = {
    title: string;
    url: string;
    position: number;
}
export type Section = {
    title: string;
    url: string;
    items: Item[];
}
export type ScrapResult = {
    source: string;
    items: Section[];
}

export class ScrapController {
    private extractDataObservador(document: Document): Item[] {
        const writingLinks: HTMLAnchorElement[] = Array.from(
            document.querySelectorAll('.editorial-grid a'),
            //document.querySelectorAll('article .article__title a')  publico
            //document.querySelectorAll('.VC010 a') diario noticias
        );
        return writingLinks.map((link, index) => {
            return {
                title: link.text.replace(/\n/g, ''),
                url: link.href,
                position: index,
            };
        });
    }
    private extractDataPublico(document: Document): Item[] {
        const writingLinks: HTMLAnchorElement[] = Array.from(
            // document.querySelectorAll('.editorial-grid a'),
            document.querySelectorAll('article .article__title a'), //  publico
            //document.querySelectorAll('.VC010 a') diario noticias
        );
        return writingLinks.map((link, index) => {
            return {
                title: link.text.replace(/\n/g, ''),
                url: link.href,
                position: index,
            };
        });
    }

    private handleDataObservador(items: Item[]): Section[] {
        const sections: Section[] = [];
        items.forEach((item: Item, index: number) => {
            const sectionIndex = sections.findIndex(sectioItem => sectioItem.title === item.title);

            if (sectionIndex >= 0) {
                sections[sectionIndex].items.push(item);
            } else if (item.url.indexOf('/seccao/') > 0) {
                sections.push({
                    title: item.title,
                    url: item.url, items: []
                });
            } else {
                if (item.title.trim() !== '') {
                    sections[sections.length - 1].items.push(item);
                }

            }
        });
        return sections;
    }

    private handleDataPublico(items: Item[]): Section[] {
        const sections: Section[] = [];
        items.forEach((item: Item) => {
            const urlParts: string[] = item.url.split('/');
            const sectionName = urlParts[4];
            const index = sections.findIndex(item => item.title === sectionName);

            if (index === -1) {
                sections.push({
                    title: sectionName,
                    url: item.url, items: []
                });
            } else {
                sections[index].items.push(item);
            }

        });
        return sections;
    }
    scrapWebPage = async (req: Request, res: Response): Promise<void> => {
        try {

            const urls = ['https://www.observador.pt', 'https://www.publico.pt', 'https://www.dn.pt/'];
            const requests = urls.map(url => axios.get(url));
            const responses: AxiosResponse[] = await Promise.all(requests);

            const dom = new JSDOM(responses[0].data);
            const items: Item[] = this.extractDataObservador(dom.window.document);
            const sections: Section[] = this.handleDataObservador(items);

            const domPublico = new JSDOM(responses[1].data);
            const itemsPublico: Item[] = this.extractDataPublico(domPublico.window.document);
            const sectionsPublico: Section[] = this.handleDataPublico(itemsPublico);

            const result: ScrapResult[] = [{ source: urls[0], items: sections }, { source: urls[1], items: sectionsPublico }];
            await addScrapResult(result);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}