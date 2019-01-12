var socket = io.connect();

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
  temp.setAttribute("class","receive");
  temp.innerHTML='<b><i>'+data.sender +'</i></b>: <br/>'+ data.msg;
  innerbox.appendChild(temp);
  innerbox.scrollTop=innerbox.scrollHeight;

});

socket.on('typing',function(data){
 feedback.innerHTML='<p>'+data.s+' is typing </p>';
});

socket.on('output',function(data){
  console.log("output"+data.length);
  if(data.length)
  {    
    for(var i=0;i<data.length;i++)
    {
      var temp=document.createElement('p');
      temp.setAttribute("class","receive");
      temp.innerHTML='<b><i>'+data[i].name +'</i></b>: <br/>'+ data[i].msg;
      innerbox.appendChild(temp);
    }
  }
  else
  {
    console.log('nothing there');
 
  }
});