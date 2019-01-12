var express =require('express');
var socket= require('socket.io');
var mongoclient= require('mongodb').MongoClient;
var url= "mongodb://public:public2all@ds215502.mlab.com:15502/mymongodb";
var app= express();
var Port=process.env.Port || 4000;

var server =app.listen(Port,function(){

    console.log("listing to port 4000");
});

var io= socket(server);
app.use(express.static('public'));

mongoclient.connect(url,{useNewUrlParser:true},function(err,db){
    if(err){
        throw err;
    }
    
    var dbo=db.db("mymongodb");
 
    io.on('connection',function(socket){
        console.log('made socket connection');
        var chat=dbo.collection("chatdata");

        chat.find({}).toArray(function(err,collection){
            
            if(err)
            {
                console.log(err);
            }
            else
            {
                socket.emit('output',collection);
                //console.log("i get all data"+collection[0].msg);
            }

        });
        
        
        socket.on('chat',function(data){  

            chat.insertOne({name:data.sender,msg:data.msg},function(){
                console.log("datainserted"+data.msg+" "+data.sender);
                socket.broadcast.emit('chat',data);
            
            });
         

        });
       
        socket.on('typing',function(data){
             socket.broadcast.emit('typing',data);
        });

        socket.on('clearchat',function(){
            dbo.collection('chatdata').drop(function(err,delOk){
                if(err) throw err;
                if(delOk){
                    console.log("deleted collection");
                }
             
            });

        });
       
       });
    
   
});
   






