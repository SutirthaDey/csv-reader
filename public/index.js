const operations = document.getElementById('operations');
const [searchByIsbn,searchByAuthor] = document.querySelectorAll('form');
const addBookMagazine = document.getElementById('add-book-magazine');
const tableBody = document.getElementById('table-body')

function populateAllData({books,magazines}){
    tableBody.innerHTML = '';
    if(books){
    books.forEach(book => {
        tableBody.innerHTML +=
        `<td>${book.title}</td>
        <td>${book.isbn}</td>
        <td>
          <ul>
            ${book.authors.map(({email})=>`<p>${email}</p>`)}
          </ul>
        </td>
        <td>${book.description}</td>
        <td><p>NA</P></td>
        </tr>  
        `
    });
  }
  if(magazines){
    magazines.forEach(magazine => {
        tableBody.innerHTML +=
        `<td>${magazine.title}</td>
        <td>${magazine.isbn}</td>
        <td>
          <ul>
            ${magazine.authors.map(({email})=>`<p>${email}</p>`)}
          </ul>
        </td>
        <td><p>NA</P></td>
        <td>${magazine.publishedAt}</td>
        </tr>  
       `
    });
   }
}

function populateByIsbn({books,magazines}){

    tableBody.innerHTML = '';
    const result = books ? books : magazines;
    if(!result) return;

    tableBody.innerHTML +=
    `<td>${result.title}</td>
    <td>${result.isbn}</td>
    <td>
        <ul>
        ${result.authors.map(({email})=>`<p>${email}</p>`)}
        </ul>
    </td>
    <td><p>${result.description?result.description:'NA'}</p></td>
    <td><p>${result.publishedAt?result.publishedAt:'NA'}</p></td>
    </tr>
        ` 
}

function populateSortedData(results){
    tableBody.innerHTML = '';
    results.result.forEach(result => {
        tableBody.innerHTML +=
        `<td>${result.title}</td>
        <td>${result.isbn}</td>
        <td>
          <ul>
            ${result.authors.split(',').map((email)=>`<p>${email}</p>`)}
          </ul>
        </td>
        <td><p>${result.description?result.description:'NA'}</p></td>
        <td><p>${result.publishedAt?result.publishedAt:'NA'}</p></td>
        </tr>  
          `
    });
}

function populateByAuthor(result){
 populateAllData(result);
}

operations.addEventListener('click',async(e)=>{
    if(e.target.value === "read csv data"){
        const response = await axios.get('http://54.148.99.72:3000/readData');
        alert('successful!');
    }
    else if(e.target.value === "get all csv data"){
        try{
            const response = await axios.get('http://54.148.99.72:3000/getAllDetails');
            populateAllData(response.data);
        }
        catch(e)
        {
            console.log(e);
        }
    }
    else if(e.target.value === 'get all data in sorted manner'){
        try{
            const response = await axios.get('http://54.148.99.72:3000/getSorted');
            populateSortedData(response.data)
        }
        catch(e)
        {
            console.log(e);
        }
    }
})

searchByIsbn.addEventListener('submit',async(e)=>{
    try{
        e.preventDefault();
        const isbn = e.target.isbn.value;
        const response = await axios.get(`http://54.148.99.72:3000/findByIsbn?isbn=${isbn}`);
        populateByIsbn(response.data);
    }
    catch(e)
    {
        console.log(e);
    }
})

searchByAuthor.addEventListener('submit',async(e)=>{
    try{
        e.preventDefault();
        const author = e.target.author.value;
        const response = await axios.get(`http://54.148.99.72:3000/findByAuthor?author=${author}`);
        populateByAuthor(response.data);
    }
    catch(e)
    {
        console.log(e);
    }
})

addBookMagazine.addEventListener('submit',async(e)=>{
    try{
        e.preventDefault();
        if(e.target.id === 'book-form'){
            const bookData = {
                title: e.target.title.value,
                isbn: e.target.isbn.value,
                authors: e.target.authors.value,
                description: e.target.description.value
            }

            await axios.post('http://54.148.99.72:3000/addBook',bookData);
            alert('book added!');
        }
        else{
            const magazineData = {
                title: e.target.title.value,
                isbn: e.target.isbn.value,
                authors: e.target.authors.value,
                publishedAt: e.target.publishedAt.value
            }

            await axios.post('http://54.148.99.72:3000/addMagazine',magazineData);
            alert('magazine added!');
        }
    }
    catch(e){

    }
    
})