let form = document.getElementById('form');
let usernameInput = document.getElementById('username')
let passwordInput = document.getElementById('password')
let c1List = document.querySelector('.c1');

// adding a request to get a token
form.addEventListener('submit',function(e){
    e.preventDefault();
     fetch("http://185.223.125.144:4000/admin/login",
     {
      method:'POST',
      body:JSON.stringify( {
          "email":usernameInput.value,
          "password":passwordInput.value
      }),
      headers: {
        'Content-Type': 'application/json',
      },
     })
     .then(function(response){
         return response.json()
     })
     .then(function(data){
        localStorage.setItem("token",data.message); //saving to localStorage
     }).then(function(){
         return secondRequest() // second request (function) to get the main object from the server
     }).then(() =>{
      usernameInput.value = "";
      passwordInput.value = "";
     })
})



// main state 
let mainState = [];
// variable for getting an url from state 
let videoSrcInHls = "";

function secondRequest(){
    fetch("http://185.223.125.144:4000/admin/channels/get",
        {
            method:'POST',
            body:JSON.stringify({
                "token": localStorage.getItem('token')
            }),
            headers: {
                'Content-Type': 'application/json',
              },
        }).then((response) =>{
            return response.json()
        }).then((data) =>{
            console.log(data);
               mainState = data.message.rows.map((item) =>{
                 return item
             })
        }).then(() =>{
            collectionCreatorForImagesList()
        })
}

let checkIdArr = []; // here we save id and img for comparison in the following scripts

function collectionCreatorForImagesList(){
    for (let i = 0; i < mainState.length; i++) {
       // dom elements 
        let div = document.createElement('div');
        let p = document.createElement('p');
        div.classList = "img";

        p.innerText = mainState[i].name; // text from main state
        div.appendChild(p);
        div.style.background = `url(${mainState[i].image})`; // img from main state
        let comparisonObject  = {
            id:mainState[i].id, // main state id
            img:mainState[i].image // main state img
        }
        checkIdArr.push(comparisonObject); // it is an important array for comparision with the localStorage urls
        localStorage.setItem(mainState[i].id, mainState[i].url); 
        
        div.style.backgroundRepeat = "no-repeat"; 
        c1List.appendChild(div); 
    }

    let img = document.querySelectorAll('.img');
    for(let i = 0; i < img.length ; i++){
        img[i].addEventListener('click', () =>{ 
          let idFromStorage = localStorage.getItem(checkIdArr[i].id) // into getItem we put checkIdArr id 
          videoSrcInHls = idFromStorage
          videoSrcInHls = `${videoSrcInHls}`;
          videoHlsStarter(videoSrcInHls)
        })
    }
} 




// using HLS script 
function videoHlsStarter(url){
let video = document.getElementById("video");
video.controls = true
let videoSrcInMp4 = "https://www.jenrenalcare.com/upload/poanchen.github.io/sample-code/2016/11/17/how-to-play-mp4-video-using-hls/sample.mp4";
let videoSrcInHls = url;
if(Hls.isSupported()) {
  let hls = new Hls();
  hls.loadSource(videoSrcInHls);
  hls.attachMedia(video);
  hls.on(Hls.Events.MANIFEST_PARSED,function() {
    video.play();
  });
}else{
  addSourceToVideo(video, videoSrcInMp4, 'video/mp4');
  video.play();
}

function addSourceToVideo(element, src, type) {
  let source = document.createElement('source');
  source.src = src;
  source.type = type;
  element.appendChild(source);
}
}





