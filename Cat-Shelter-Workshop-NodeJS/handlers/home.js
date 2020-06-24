const url = require('url');
const fs = require('fs');
const path = require('path');
// const cats = require('../data/cats.json');
const helpers = require('./helpers');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/' && req.method === 'GET') {
        const filePath = path.normalize(path.join(__dirname, '../views/home/index.html'));

        fs.readFile('./data/cats.json', 'utf-8', (error, data) => {

            helpers.errorPostHandler(error)

            let allCats = JSON.parse(data);
            fs.readFile(filePath, (error, data) => {

                helpers.errorGetHandler(error);

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                let modifiedCats = allCats.map(cat => `<li>
            <img src="${path.join('/content/images/' + cat.image)}" alt="${cat.name}">
            <h3>${cat.name}</h3>
					<p><span>Breed: </span>${cat.breed}</p>
					<p><span>Description: </span>${cat.description}</p>
					<ul class="buttons">
						<li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
						<li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
					</ul>
                </li>`)

                let modfiedData = data.toString().replace('{{cats}}', modifiedCats);
                res.write(modfiedData);
                res.end();

            });
        });
    } else {
        return true;
    }
}