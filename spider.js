import { promises as fsPromises } from 'fs';
import { dirname } from 'path';
import superagent from 'superagent';
import mkdirp from 'mkdirp';
import { urlToFilename, getPageLinks } from './utils.js';
import { promisify } from 'util';

const mkdirpPromise = promisify(mkdirp);

// la declaracion await siempre debe ir acompañado con el async
async function download(url, filename) {
    console.log(`Downloading ${url}`);
    const { text: content } = await superagent.get(url);
    await mkdirpPromise(dirname(filename))
    await fsPromises.writeFile(filename, content)
    console.log(`Downloaded and saved: ${url}`);
    return content
}

async function spiderLinks(currentUrl, content, nesting) {
    if (nesting === 0) {
        return;
    }
    const links = getPageLinks(currentUrl, content);
    for (const link of links) {
        await spider(link, nesting - 1)
    }
}
// tpdo en javascript asincrono (azucar sintatica) => JS6
export async function spider(url, nesting) {
    const filename = urlToFilename(url);
    let content;
    try {
        // Cuando una funcion devuelve una promise, se puede trabajar con la funcion await
        content = await fsPromises.readFile(filename, 'utf8')
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
        content = await download(url, filename)
    }
    return spiderLinks(url, content, nesting);
}

// Superset => Encasupsulacion del sintaxis de javascript pero orientado y reforzado con clases, interfaces, clases
// abstractas, herencia, polimorfismo, patrones de diseño,etc. (POO , Programacion funcional, Programacion reactiva)