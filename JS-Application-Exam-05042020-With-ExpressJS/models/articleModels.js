const fs = require('fs');
const path = require('path');

class ArticleModel {
    constructor() {
        this.articleData = require('../config/articleDb.json')
    }

    _write(newData, resolveData) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.resolve('./config/articleDb.json'), JSON.stringify(newData, null, 2), (err) => {
                if (err) { reject(err); return; }
                this.articleData = newData;
                resolve(resolveData);
            });
        });
    }

    get articlesCategory() {
        return this.articleData.articlesCategory;
    }

    getAllArticles() {
        return Promise.resolve(this.articleData.articles);
    }

    getOneArticle(id) {
        return Promise.resolve(this.articleData.articles.find(({ id: articleId }) => articleId === id));
    }

    changeArticle(article) {
        const newArticleData = {
            "lastIndex": this.articleData.lastIndex,
            "articles": this.articleData.articles.map(art => art.id !== article.id ? art : Object.assign(art, article)),
            "articlesCategory": this.articleData.articlesCategory.slice(0)
        }
        return this._write(newArticleData, article);
    }

    delete(id) {
        const newArticleData = {
            "lastIndex": this.articleData.lastIndex,
            "articles": this.articleData.articles.filter(art => art.id !== id),
            "articlesCategory": this.articleData.articlesCategory.slice(0)
        }
        return this._write(newArticleData, id);
    }

    add(article) {
        const idNewArticle = ++this.articleData.lastIndex;
        const newArticle = Object.assign({}, { id: idNewArticle, ...article });
        this.articleData.articlesCategory.map(category => {
            if (category.title === newArticle.category) { newArticle.category = category.descr; }
        })
        const newArticleData = {
            "lastIndex": this.articleData.lastIndex,
            "articles": this.articleData.articles.slice(0).concat(newArticle),
            "articlesCategory": this.articleData.articlesCategory.slice(0)
        }

        return this._write(newArticleData, article);
    }
}

module.exports = new ArticleModel();