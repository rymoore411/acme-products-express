const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs')
app.use(express.json())

const path = require('path')
const FILE = path.join(__dirname, 'products.json')


//Write data
const write = (filePath, products)=> {
  return new Promise((resolve, reject)=>{
    if(!Array.isArray(products)){
      return reject('products must be an array');
    }
    fs.writeFile(filePath, JSON.stringify(products), (err)=>{
      if(err){
        return reject(err);
      }
      resolve();
    })
  })

}

//Read data

const read = (filePath)=> {
  return new Promise((resolve, reject)=> {
    fs.readFile(filePath, (err, products)=> {
      if(err){
        return reject(err);
      }
      let results;
      try{
        results = JSON.parse(products.toString());
        if(!Array.isArray(results)){
          return reject('Data must be an array')
        }
      }
      catch(ex){
        return reject(ex);
      }
      resolve(results);
    })
  })
}


app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/products', (req, res, next)=> res.sendFile(path.join(__dirname, 'products.json')));

app.post('/api/products', (req, res, next)=> {
  const post = req.body;

  read(FILE)
  .then(prod => {
    prod.push(post)
    write(FILE, prod)
  })
  .then(()=>res.send('products'))

});

app.delete('/api/products/:id', (req, res, next)=> {
  const deleteId = req.params.id*1;
  console.log(deleteId);
  read(FILE)
  .then(prod => {
    const products = prod.filter((el, id)=>{
    return( id !== deleteId )
  })
    write(FILE, products)
  })

});

app.listen(port, ()=> console.log(`listening on port ${port}`));
