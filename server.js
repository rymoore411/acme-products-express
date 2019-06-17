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

write(FILE, [{name: 'moe'}, {name: 'larry'}])
  .then(()=> read(FILE))
  .then(prod => {
    prod.push({name: 'shep'});
    return write(FILE, prod);
  })
  .then(()=>console.log('we saved a product!'))
  .catch(ex => console.log(ex));


app.get('/', (req, res, next)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/products', (req, res, next)=> res.sendFile(path.join(__dirname, 'products.json')));

app.post('/api/products', (req, res, next)=> {
  const post = req.body;
  console.log(post);

  write(FILE, [{name: 'moe'}, {name: 'larry'}])
  .then(()=> read(FILE))
  .then(prod => {
    prod.push(post);
    return write(FILE, prod);
  })
  .then(()=>console.log('we saved a product!'))
  .catch(ex => console.log(ex));
  // res.redirect('/#/products');
});

app.listen(port, ()=> console.log(`listening on port ${port}`));
