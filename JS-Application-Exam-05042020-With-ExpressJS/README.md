# JS Application Exam in SoftUni from 05.04.2020

## SoftWiki is a SPA.

It was implement with expressJS, express-handlebars, cookie-parser and jsonwebtoken.

## Application structure.

The application have public part and private part.

### Public part

The public part is visible without authetntication and consists: 

#### register form:  
![Register form](https://github.com/TodorovStanimir/JS-Back-End-September-2019-SoftUni/blob/master/JS-Application-Exam-05042020-With-ExpressJS/images/userRegister.png)

#### login form:
![Login form](https://github.com/TodorovStanimir/JS-Back-End-September-2019-SoftUni/blob/master/JS-Application-Exam-05042020-With-ExpressJS/images/userLogin.png)

### Private part

The private part is visible for all successful login users.

It holds managment functionality for the articles and consists:

#### home page - all articles listing.
![home page - all articles](https://github.com/TodorovStanimir/JS-Back-End-September-2019-SoftUni/blob/master/JS-Application-Exam-05042020-With-ExpressJS/images/home.png)

- page showing all articles in application, separeted in four sections.

In this page each user can navigate to details page of the article. 

#### details information for article if user is creator of the article.
![article details, if user is creator of the article](https://github.com/TodorovStanimir/JS-Back-End-September-2019-SoftUni/blob/master/JS-Application-Exam-05042020-With-ExpressJS/images/articleDetails%20if%20user%20is%20creator%20article.png)

#### details information for article if user is not creator of the article.
![article details, if user is not creator of the article](https://github.com/TodorovStanimir/JS-Back-End-September-2019-SoftUni/blob/master/JS-Application-Exam-05042020-With-ExpressJS/images/articleDetails%20if%20user%20is%20not%20creator%20article.png)

Here user can navigate to edit the article /if is creator of the article/, can delete article /if is creator of the article/.

#### create a new article
![create a new article](https://github.com/TodorovStanimir/JS-Back-End-September-2019-SoftUni/blob/master/JS-Application-Exam-05042020-With-ExpressJS/images/articleCreate.png)

- page for creating a new article. Here user can add a new article.

#### edit an existing article
![edit the article](https://github.com/TodorovStanimir/JS-Back-End-September-2019-SoftUni/blob/master/JS-Application-Exam-05042020-With-ExpressJS/images/articleEdit.png)

- page for editing an existing article.

Application is separated in:

- config folder. It consists config.js, express.js and routes.js files, and dataBases - articleDb.json and usersDb.json;
- controllers folder. It consists two files - articleControllers.js and userControllers.js;
- models folder. It consists two files - articleModels.js and userModels.js;
- static folder. It consists images and styles folders;
- views folder. It consists all views handelbar files;
