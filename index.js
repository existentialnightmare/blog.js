fs = require('fs');
var md = require('markdown-it')();
const express = require('express')
const app = express()
const port = 3000

var blogconfig = JSON.parse(fs.readFileSync("blog-config.json"));

var css = `
body{
  font-family: arial, helvetica, monospace;
  font-size: 18pt;
  color: white;
  background: black;
}
.text-outer{
  display: grid;
  place-items: center;
}
`

const hhead = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
    <title>Document</title>
</head>
<body>
<a href="/"><img src="${blogconfig.iconURL}" alt="Your icon here" class="icon" height=100></a>
<div class="text-outer">`;

const hend = `
</div>
</body>
</html>`;


app.get('/read/:id', (req, res) => {
  res.write(hhead)
  fs.readFile('md/'+req.params.id+blogconfig.postfix, 'utf8', function (err,data){
    res.write(md.render(data));
    res.write(hend)
    res.send()
  });
})

app.get('/edit/:id', (req, res) => {
  res.write("<html><body>")
  fs.readFile('md/'+req.params.id+blogconfig.postfix, 'utf8', function (err,data){
    res.write(`
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
  <script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
  <style>@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap'); body{font-family: Lato;}</style>
    <textarea id="MyID" rows="4" cols="50">${data}</textarea>
    <input id="pw" type="password">
    <button onclick="send()">Save</button>
  <script>
  var simplemde = new SimpleMDE({ element: document.getElementById("MyID") });
  var pwf
  var pw
  var body
  var bodyf
  </script>
  <script>
  function send() {
      pwf = document.getElementById("pw").value
      pw = btoa(pwf).replace('/', '_').replace('+', '-')
      bodyf = simplemde.value();
      body = btoa(bodyf).replace('/', '_').replace('+', '-')
      let path = window.location.pathname.split("/");
      fetch('/update/'+path[2]+'/'+body+'/'+pw)
  }
</script>
    `)
    res.write(hend)
    res.send()
  });
})

app.get('/update/:id/:body/:auth', (req, res) => {
  let decodedBody = Buffer.from(req.params.body.replace('_', '/').replace('-', '+'), 'base64').toString('utf-8')
  let decodedAuth = Buffer.from(req.params.auth.replace('_', '/').replace('-', '+'), 'base64').toString('utf-8')
  if(decodedAuth == blogconfig.password){
    fs.writeFile('md/'+req.params.id+blogconfig.postfix, decodedBody, 'utf8', function (err,data){
      res.send("Done")
    })
  }else{res.send("Auth Error")}
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
