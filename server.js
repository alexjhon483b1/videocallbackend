const express = require("express")
const app = express()
const server = require("http").createServer(app)
const io = require('socket.io')(server, {cors: {origin:"*"}})

app.get('/',function(req, res){
    res.sendFile('test.html',{root:__dirname})
});
server.listen(process.env.PORT || 3329, ()=>{
    console.log("server running");
});

io.on("connection", (socket)=>{  
    socket.on("IP2", (data)=>{
        console.log(data)
        io.emit('response', data);
    })  
})
