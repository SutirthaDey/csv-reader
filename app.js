const express = require('express');
const path = require('path');
const csvOperationsRoute = require('./routes/csvOperations');
const csvOperationsController = require('./controller/csvOperations');
const sequelize = require('./utils/database')
const Author = require('./model/author');
const Book = require('./model/book');
const Magazine = require('./model/magazine');
const BookDetails = require('./model/BookDetails');
const MagazineDetails = require('./model/MagazineDetails');
const app = express();

app.use(express.static(path.join(__dirname+'/public')));
app.use(express.json());

Author.belongsToMany(Book,{through: BookDetails});
Book.belongsToMany(Author,{through: BookDetails});

Author.belongsToMany(Magazine, {through: MagazineDetails});
Magazine.belongsToMany(Author, {through: MagazineDetails});

app.use(csvOperationsRoute);
app.get('/',(req,res,next)=>{
   res.sendFile(path.join(__dirname,'public','index.html'));
})

async function runServer(){
   await sequelize.sync();
   app.listen(3000,()=>{
      console.log('server is running!')
   })
}

runServer()
