const express = require('express');
const csvController = require('../controller/csvOperations');

const router = express.Router();

router.get('/getAllDetails', csvController.getAllBooksAndMagazines);
router.get('/findbyIsbn',csvController.findByIsbn)
router.get('/findByAuthor',csvController.findByEmail);
router.get('/getSorted',csvController.getSorted);
router.get('/readData',csvController.readData);
router.post('/addBook',csvController.addBook);
router.post('/addMagazine',csvController.addMagazine);

module.exports = router;