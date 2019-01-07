var express =require('express');
var socket= require('socket.io');
var mongoclient= require('mongodb').MongoClient;
//var url= "mongodb://gurcharan:gurcharan99@ds215502.mlab.com:15502/mymongodb";
var url="mongodb://localhost/mymongodb";
var app= express();

var server =app.listen(4000,function(){

    console.log("listing to port 4000");
});

var io= socket(server);

mongoclient.connect(url,{useNewUrlParser:true},function(err,db){
    if(err){
        throw err;
    }
    
    var dbo=db.db("mymongodb");
    
    /*dbo.createCollection("chatdata",function(err,res){
        if(err){
            throw err;
        }
        console.log('chatdata collection created');
      
        db.close();

    });*/
      
    //db.close();
 
    io.on('connection',function(socket){
        console.log('made socket connection');
        var chat=dbo.collection("chatdata");
        /*
        dbo.collection('chatdata').drop(function(err,delOk){
            if(err) throw err;
            if(delOk){
                console.log("deleted collection");
            }
         
        });
       */

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
           // var cursor=chat.find({});
            //console.log(cursor);

        });
        
        
        socket.on('chat',function(data){  

            chat.insertOne({name:data.sender,msg:data.msg},function(){
                console.log("datainserted"+data.msg+" "+data.sender);
                //io.sockets.emit('chat',data);
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
   
app.use(express.static('public'));





