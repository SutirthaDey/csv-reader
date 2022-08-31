const papa = require('papaparse');
const path = require('path');
const Sequelize = require('sequelize')
const sequelize = require('../utils/database');
const fs = require('fs').promises;
const Author = require('../model/author');
const Book = require('../model/book');
const BookDetails = require('../model/BookDetails');
const Magazine = require('../model/magazine');
const MagazineDetails = require('../model/MagazineDetails');
const authorsPath = path.join(__dirname+'/../data', 'Authors.csv');
const booksPath = path.join(__dirname+'/../data', 'Books.csv');
const magazinesPath = path.join(__dirname+'/../data','Magazines.csv');
const Op = Sequelize.Op;

const readCSV = async (filePath)=>{
    const file = await fs.readFile(filePath,'binary');

    return new Promise((resolve,reject)=>{
        papa.parse(file, {
        header: true,
        complete: function(results) {
            resolve(results.data);
        },
        error: function(error,file){
            reject('1');
        }
      })
    });
}

const saveAuthorsToDB = async()=>{
    const authors = await readCSV(authorsPath);
    // const books = await readCSV(booksPath);
    // const magazines = await readCSV(magazinesPath);

    
    const promises = await authors.map(async({email,firstname,lastname})=>{
        const ifAuthorExists = await Author.findOne({
          where: {email:email}
          });
         return !ifAuthorExists;
        })

    const booleans = await Promise.all(promises);
    const newAuthors = authors.filter((_,i)=> booleans[i]);

    await Promise.all(
      newAuthors.map(async({email,firstname,lastname}) => {
        return await Author.create({
        email: email,
        firstName: firstname,
        lastName: lastname
       })
     })
    ) 
}

const saveBooksToDB = async()=>{
  const books = await readCSV(booksPath);

  const promises = await books.map(async({isbn})=>{
    const ifBookExists = await Book.findOne({
      where: {isbn:isbn}
      });
     return !ifBookExists;
    });
  
  const booleans = await Promise.all(promises);
  const newBooks = books.filter((_,i)=> booleans[i]);
  
  await Promise.all(newBooks.map(async(eachBook)=>{
    const newBook = await Book.create({
      title:eachBook.title,
      isbn:eachBook.isbn,
      description:eachBook.description
    });

    eachBook.authors.split(',').forEach(async(eachAuthor)=>{
      const author = await Author.findOne({where:{email:eachAuthor}});
      await newBook.addAuthor(author,{through:BookDetails})
    })

  }))

}

const saveMagazinesToDB = async()=>{
  const magazines = await readCSV(magazinesPath);

  const promises = await magazines.map(async({isbn})=>{
    const ifMagazineExists = await Magazine.findOne({
      where: {isbn:isbn}
      });
     return !ifMagazineExists;
    });
  
  const booleans = await Promise.all(promises);
  const newMagazines = magazines.filter((_,i)=> booleans[i]);
  
  await Promise.all(newMagazines.map(async(eachMagazine)=>{
    const newMagazine = await Magazine.create({
      title:eachMagazine.title,
      isbn:eachMagazine.isbn,
      publishedAt: new Date(eachMagazine.publishedAt.split('.').reverse().join('.'))
    });

    eachMagazine.authors.split(',').forEach(async(eachAuthor)=>{
      const author = await Author.findOne({where:{email:eachAuthor}});
      await newMagazine.addAuthor(author,{through:MagazineDetails})
    })

  }))
}

const readData = async(req,res,next)=>{
 try{
    await saveAuthorsToDB();
    await saveBooksToDB();
    await saveMagazinesToDB();
    res.json({success:true})
 }
 catch(e)
 {
    res.status(404).json({message:e.message});
 }
}

const getAllBooksAndMagazines = async(req,res,next)=>{
  try{
    const books = await Book.findAll({
      attributes:['title','isbn','description'],
      include:[{
        model:Author,
        attributes:['email'],
        through:{
          attributes:[]
        }
      }]
    })

    const magazines = await Magazine.findAll({
      attributes:['title','isbn','publishedAt'],
      include:[{
        model: Author,
        attributes:['email'],
        through:{
          attributes:[]
        }
      }]
    })
    res.status(200).json({books:books,magazines:magazines})
   }
  catch(e){
    res.status(404).json({message:e.message});
   }
}

const findByIsbn = async(req,res,next)=>{
  const isbn = req.query.isbn;

  try{
    const books = await Book.findOne({
      where: {isbn:isbn},
      attributes:['title','isbn','description'],
      include:[{
        model:Author,
        attributes:['email'],
        through:{
          attributes:[]
        }
      }]
    })

    const magazines = await Magazine.findOne({
      where: {isbn:isbn},
      attributes:['title','isbn','publishedAt'],
      include:[{
        model: Author,
        attributes:['email'],
        through:{
          attributes:[]
        }
      }]
    })
    res.status(200).json({books:books,magazines:magazines})
   }
  catch(e){
    res.status(404).json({message:e.message});
   }
}

const findByEmail = async(req,res,next)=>{
  const email = req.query.author;

  try{
    const author = await Author.findOne({
      where:{email:email}
    })

    if(!author){
      return res.json({books:null,magazines:null})
    }

    const books = await Book.findAll({
      attributes:['title','isbn','description'],
      include:[{
        model:Author,
        attributes:['email'],
        where:{id:author.id},
        through: {
          attributes: [],
        }
      }]
    })
    
    const magazines = await Magazine.findAll({
      attributes:['title','isbn','publishedAt'],
      include:[{
        model:Author,
        attributes:['email'],
        where:{id: author.id},
        through: {
          attributes: [],
        }
      }]
    })

    res.status(200).json({books:books,magazines:magazines})
   }
  catch(e){
    res.status(404).json({message:e.message});
   }
}

const getSorted = async(req,res,next)=>{
  try{
    const books = await readCSV(booksPath);
    const magazines = await readCSV(magazinesPath);
    
    const result = books.concat(magazines);
    result.sort((a,b)=> a.title<b.title? -1:1);
    res.status(200).json({result:result})
   }
  catch(e){
    res.status(404).json({message:e.message});
   }
}

const addBook = async(req,res,next)=>{
 try{
  const bookData = req.body;
  let header = true;
  const filepath = path.join(__dirname+'/../data/newBooks.csv');
  try {
    await fs.access(filepath);
    header = false;
    } catch (error) {}
  const csvBook = papa.unparse([bookData],{header:header});
  await fs.appendFile(filepath,csvBook+'\r\n');
  res.json({success:true});
 }
 catch(e)
 {
  console.log(e);
  res.status(404).json({message:e.message});
 }
}

const addMagazine = async(req,res,next)=>{
  try{
    const magazineData = req.body;
    let header = true;
    const filepath = path.join(__dirname+'/../data/newMagazines.csv');

    try {
      await fs.access(filepath);
      header = false;
      } catch (error){}

    const csvMagazine = papa.unparse([magazineData],{header:header});
    await fs.appendFile(filepath,csvMagazine+'\r\n');
    res.json({success:true});
   }
   catch(e)
   {
    res.status(404).json({message:e.message});
   }
}
module.exports = {
    readCSV,
    getAllBooksAndMagazines,
    saveAuthorsToDB,
    saveBooksToDB,
    saveMagazinesToDB,
    findByIsbn,
    findByEmail,
    getSorted,
    addBook,
    addMagazine,
    readData
}