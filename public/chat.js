
var socket = io.connect('http://localhost:4000');

var msg=document.getElementById('msg');
var innerbox=document.getElementById('innerbox');
var sendbtn=document.getElementById('sendbtn');
var sender=document.getElementById('sender');
var feedback=document.getElementById('feedback');
var clear=document.getElementById('clearchatbtn');
sendbtn.addEventListener('click',function(){
    
    socket.emit('chat',{
      msg: msg.value,
      sender: sender.value
    });
    //sender.innerHTML=" ";
    // sender.innerHTML=" ";
    var temp=document.createElement('p');
    temp.setAttribute("class","send");
    temp.textContent=msg.value;
    innerbox.appendChild(temp);
    msg.value=" ";
    
    
    
    innerbox.scrollTop=innerbox.scrollHeight;
     

});

msg.addEventListener('keypress',function(){
    
  socket.emit('typing',{s:sender.value});
});

clear.addEventListener('click',function(){
  socket.emit('clearchat');

});


socket.on('chat',function(data){
  feedback.innerHTML=" ";
  var temp=document.createElement('p');
//  var textnode=document.createTextNode(data.sender+" : "+data.msg);
 // temp.className('send');
  //temp.appendChild(textnode);
  temp.setAttribute("class","receive");
 //temp.style.backgroundColor="lightBlue";
  //temp.=data.sender+" : "+data.msg;
  temp.innerHTML='<b><i>'+data.sender +'</i></b>: <br/>'+ data.msg;
  //innerbox.innerHTML+='<p>'+data.sender +" : "+ data.msg+'</p>';
  innerbox.appendChild(temp);
  innerbox.scrollTop=innerbox.scrollHeight;
 // console.log("chat socket called");

});

socket.on('typing',function(data){
  //console.log("typing")
 feedback.innerHTML='<p>'+data.s+' is typing </p>';
});

socket.on('output',function(data){
  console.log("output"+data.length);
  if(data.length)
  {
   
    
    for(var i=0;i<data.length;i++)
    {
      //console.log(data[i].msg);
      var temp=document.createElement('p');
      temp.setAttribute("class","receive");
      temp.innerHTML='<b><i>'+data[i].name +'</i></b>: <br/>'+ data[i].msg;
     // temp.style.backgroundColor="green";
      //innerbox.innerHTML+='<p>'+data[i].name +" : "+ data[i].msg+'</p>';
      innerbox.appendChild(temp);
    }
  }
  else
  {
    console.log('nothing there');
 
  }
});
//console.log('connect chatjs');