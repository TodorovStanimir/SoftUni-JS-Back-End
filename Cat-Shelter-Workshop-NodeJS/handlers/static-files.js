const url = require('url');
const fs = require('fs');
const helpers = require('./helpers')

function getContentType(url) {
    if (url.endsWith('css')) {
        return 'text/css';
    } else if (url.endsWith('html')) {
        return 'text/html';
    } else if (url.endsWith('js')) {
        return 'text/javascript';
    } else if (url.endsWith('png')) {
        return 'image/png';
    } else if (url.endsWith('jpg') || url.endsWith('jpeg') || url.endsWith('jfif') || url.endsWith('pjpeg') || url.endsWith('pjp')) {
        return 'image/jpeg';
    } else if (url.endsWith('ico') || url.endsWith('cur')) {
        return 'image/x-icon'
    }
}

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname.startsWith('/content') && req.method === 'GET') {

        if (pathname.endsWith('png') || pathname.endsWith('jpg') || pathname.endsWith('jpeg') || pathname.endsWith('ico')) {

            fs.readFile(`./${pathname}`, (error, data) => {

                helpers.errorGetHandler(error);

                res.writeHead(200, {
                    'Content-Type': getContentType(pathname)
                });

                res.write(data);
                res.end();
            })

        } else {

            fs.readFile(`./${pathname}`, 'utf-8', (error, data) => {

                helpers.errorGetHandler(error);

                res.writeHead(200, {
                    'Content-Type': getContentType(pathname)
                });
                
                res.write(data);
                res.end();
            })
        };
    } else {
        return true;
    }
}