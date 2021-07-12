const axios = require('axios');
fs = require('fs');
var md = require('markdown-it')();
const express = require('express')
const app = express()
const port = 3000


const hhead = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<img src="" alt="Your icon here">`;

const hend = `
</body>
</html>`;


app.get('/read/:id', (req, res) => {
  res.write(hhead)
  fs.readFile('md/'+req.params.id, 'utf8', function (err,data){
    res.write(md.render(data));
    res.write(hend)
    res.send()
  });
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})