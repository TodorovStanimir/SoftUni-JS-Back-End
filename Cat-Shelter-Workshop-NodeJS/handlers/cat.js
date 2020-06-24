const url = require('url');
const fs = require('fs');
const path = require('path');
// const cats = require('../data/cats.json');
// const breeds = require('../data/breeds.json');
const qs = require('querystring');
const formidable = require('formidable');
const helpers = require('./helpers');

module.exports = (req, res) => {

    const pathname = url.parse(req.url).pathname;

    if (pathname === '/cats/add-cat' && req.method === 'GET') {

        const filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));

        fs.readFile('./data/breeds.json', 'utf-8', (error, data) => {

            helpers.errorGetHandler(error);

            const breeds = JSON.parse(data);

            fs.readFile(filePath, (error, data) => {

                helpers.errorGetHandler(error);

                const catBreedPlaceholder = breeds.map(breed => `<option value="${breed}">${breed}</option>`);
                const modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);

                res.writeHead(200, { 'Content-Type': 'text/html' });

                res.write(modifiedData);
                res.end();
            });
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {

        const filePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));

        fs.readFile(filePath, (error, data) => {

            helpers.errorGetHandler(error);

            res.writeHead(200, { 'Content-Type': 'text/html' });

            res.write(data);
            res.end();
        });
    } else if (pathname.includes('/cats-edit') && req.method === 'GET') {

        const id = Number(req.url.split('/').pop());

        fs.readFile('./data/cats.json', 'utf-8', (error, data) => {

            helpers.errorPostHandler(error)

            let allCats = JSON.parse(data);

            const editedCat = allCats.find(cat => cat.id === id);

            fs.readFile('./data/breeds.json', 'utf-8', (error, data) => {

                helpers.errorPostHandler(error)

                const breeds = JSON.parse(data);

                const filePath = path.normalize(path.join(__dirname, '../views/editCat.html'));

                fs.readFile(filePath, (error, data) => {

                    helpers.errorGetHandler(error);

                    res.writeHead(200, { 'Content-Type': 'text/html' });

                    const catBreedPlaceholder = breeds.map(breed => {
                        return breed === editedCat.breed
                            ? `<option value="${breed}" selected="selected">${breed}</option>`
                            : `<option value="${breed}">${breed}</option>`
                    }).join('');

                    let modifiedCat = data.toString().replace('{{id}}', id);
                    modifiedCat = modifiedCat.toString().replace('{{name}}', editedCat.name);
                    modifiedCat = modifiedCat.toString().replace('{{description}}', editedCat.description);
                    modifiedCat = modifiedCat.toString().replace('{{image}}', editedCat.image);
                    modifiedCat = modifiedCat.toString().replace('{{catBreeds}}', catBreedPlaceholder);

                    res.write(modifiedCat);
                    res.end();
                });
            });
        });
    } else if (pathname.includes('/cats-find-new-home') && req.method === 'GET') {

        const id = Number(req.url.split('/').pop());

        fs.readFile('./data/cats.json', 'utf-8', (error, data) => {

            helpers.errorPostHandler(error)

            let allCats = JSON.parse(data);
            const catFindNewHome = allCats.find(cat => cat.id === id);

            fs.readFile('./data/breeds.json', 'utf-8', (error, data) => {

                helpers.errorPostHandler(error)

                const breeds = JSON.parse(data);

                const filePath = path.normalize(path.join(__dirname, '../views/catShelter.html'));

                fs.readFile(filePath, (error, data) => {

                    helpers.errorGetHandler(error);

                    res.writeHead(200, { 'Content-Type': 'text/html' });

                    const catBreedPlaceholder = breeds.map(breed => {
                        return breed === catFindNewHome.breed
                            ? `<option value="${breed}" selected="selected">${breed}</option>`
                            : `<option value="${breed}">${breed}</option>`
                    }).join('');

                    let modifiedCat = data.toString().replace('{{id}}', id);
                    modifiedCat = modifiedCat.toString().replace('{{name}}', catFindNewHome.name);
                    modifiedCat = modifiedCat.toString().replace('{{description}}', catFindNewHome.description);
                    modifiedCat = modifiedCat.toString().replace('{{image}}', catFindNewHome.image);
                    modifiedCat = modifiedCat.toString().replace('{{catBreeds}}', catBreedPlaceholder);

                    res.write(modifiedCat);
                    res.end();
                });
            });
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {

        let formData = '';

        req.on('data', (data) => {
            formData += data;
        });

        req.on('end', () => {

            let body = qs.parse(formData);

            fs.readFile('./data/breeds.json', (error, data) => {

                helpers.errorPostHandler(error);

                if (body.breed !== '') {

                    const breeds = JSON.parse(data);
                    breeds.push(body.breed);
                    const json = JSON.stringify(breeds);

                    fs.writeFile('./data/breeds.json', json, 'utf-8', () => {

                        console.log('The breed was added successfully!');
                    });
                }
            });

            res.writeHead(301, { location: '/' });
            res.end();
        });
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {

        let form = new formidable.IncomingForm();

        form.parse(req, (error, fields, files) => {

            helpers.errorPostHandler(error)
            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join(__dirname, '../content/images/' + files.upload.name));

            fs.copyFile(oldPath, newPath, function (err) {
                console.log('File was uploaded successfully!');
            });

            fs.readFile('./data/cats.json', 'utf-8', (error, data) => {

                helpers.errorPostHandler(error)

                let allCats = JSON.parse(data);
                allCats.push({ id: allCats[allCats.length-1].id + 1, ...fields, image: files.upload.name });
                const json = JSON.stringify(allCats);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(301, { location: '/' });
                    res.end();
                });
            });
        });
    } else if (pathname.includes('/cats-edit') && req.method === 'POST') {

        const id = Number(req.url.split('/').pop());

        let form = new formidable.IncomingForm();

        form.parse(req, (error, fields, files) => {

            helpers.errorPostHandler(error)

            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join(__dirname, '../content/images/' + files.upload.name));

            fs.copyFile(oldPath, newPath, function (err) {
                console.log('File was uploaded successfully!');
            });

            fs.readFile('./data/cats.json', 'utf-8', (err, data) => {

                helpers.errorPostHandler(error)

                let allCats = JSON.parse(data);
                allCats = allCats.map(cat => {
                    return cat.id !== id ? cat : Object.assign({ id: id, ...fields, image: files.upload.name ? files.upload.name : cat.image });
                });
                let json = JSON.stringify(allCats);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(301, { location: '/' });
                    res.end();
                });
            });
        });
    } else if (pathname.includes('/cats-find-new-home') && req.method === 'POST') {

        const id = Number(req.url.split('/').pop());

        fs.readFile('./data/cats.json', 'utf-8', (error, data) => {

            helpers.errorPostHandler(error)

            const allCats = JSON.parse(data);
            const modifiedAllCats = allCats.filter(cat => cat.id !== id);
            const json = JSON.stringify(modifiedAllCats);
            const catImageFileName = allCats.find(cat => cat.id === id).image;
            const catImageFilePath = path.normalize(path.join(__dirname, '../content/images/' + catImageFileName));

            if (!modifiedAllCats.find(cat => cat.image === catImageFileName)) {
                fs.unlink(catImageFilePath, error => {
                    helpers.errorPostHandler(error)
                });
            }
            fs.writeFile('./data/cats.json', json, () => {
                res.writeHead(301, { location: '/' });
                res.end();
            });

        });
    } else {
        return true;
    }
}


