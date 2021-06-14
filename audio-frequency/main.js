window.AudioContext = window.AudioContext || window.webkitAudioContext;


const canv = document.querySelector("#c");
const c = canv.getContext("2d");

var wh, ww, playing = false, angle = Math.PI, fps = 60, analyser, bufferLength, bufferArray, color = 0 ;

window.onresize = function(){
  wh = canv.height = window.innerHeight;
  ww = canv.width = window.innerWidth;
};onresize();

function canvas(){
  c.clearRect(0,0,ww,wh);
  if(color > 360){color = 0}
  c.strokeStyle = c.fillStyle = "hsl("+ color + ", 95%, 50%)";
  color += 0.1;
  c.beginPath();
  c.textAlign = "center";
  c.textBaseline = "top";
  c.font = "20px bold verdana";
  c.fillText("By Monu Sharma", ww/2,1);
  if (playing) {
    
    let buffWidth = ((ww/bufferLength));
    var x = 0;
    let y = wh/2;
    
    analyser.getByteFrequencyData(bufferArray);
    if(bufferArray[3] > 2){color += 10}
    for (var i = -bufferArray.length+3; i < bufferArray.length; i++) {
      
      buffHeigth = bufferArray[Math.abs(i)]*2;
      x += buffWidth/2 +2;
      
      c.fillRect(x,y - ( buffHeigth / 2 ) ,-buffWidth/2,buffHeigth);
    };
    
  } else {
    //loading animation --->
    c.beginPath();
    angle += 0.03;
    if(angle > Math.PI*3){angle=Math.PI};
    c.lineWidth = ~~(ww/50);
    c.arc(ww/2,wh/2,~~(ww/16),angle+Math.PI*1.6/3,angle);
    c.stroke();
  }setTimeout(canvas,1000/fps);
};
function loadMp3() {
  let audio = new AudioContext();
  if (audio) {
    canvas();
  };
  source = audio.createBufferSource();
  analyser = audio.createAnalyser();
  source.connect(analyser).connect(audio.destination);
  let request = new XMLHttpRequest();
  request.open('GET', 'music.mp3', true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    audio.decodeAudioData(request.response, function(response) {
      source.buffer = response;
      source.start(0);
      playing = true;
      source.loop = true;
    }, function() { console.log("music error: ??? ") });
  };request.send();
  console.log(analyser);
  analyser.fftSize = 32;
  analyser.maxDecibels = -10;
  analyser.minDecibels = -40;
  bufferLength = analyser.frequencyBinCount;
  bufferArray = new Uint8Array(bufferLength);
  console.log(bufferArray);
};

window.onload =()=>{loadMp3();}
alert("hi")