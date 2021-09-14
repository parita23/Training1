const express=require("express");
const app=express();
const port=5000;

app.get('/',(req,res)=>{
    res.send('Hello World!');
});
app.get('/about.html',(req,res)=>{
    res.send('about page!');
});
app.get('/contact.html',(req,res)=>{
    res.send('contact us!');
});

app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
});