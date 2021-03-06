
let mediaRec;
let wsconnection;

function connectToServer(){
    wsconnection = new WebSocket(`ws://${document.querySelector('.serverAddr').value}:8082/`);
    wsconnection.onopen = function(){
        console.log('connected');
    }
}

async function startCapture(){
    let videoElem = document.querySelector('.displayVideo');

    const gdmOptions = {
        video: {
            cursor: "always"
        },
        audio: false
    }

    var options = {
        audioBitsPerSecond : 128000,
        videoBitsPerSecond : 250000,
        mimeType : 'video/webm;codecs=vp8'
    }

    let captureStream = null;

    try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(gdmOptions);
        videoElem.srcObject = captureStream;
        mediaRec = new MediaRecorder(captureStream,options);

        mediaRec.ondataavailable = function(e){
            console.log(`data available (${e.data.size} bytes)`);
            if(e.data.size > 0){
                wsconnection.send(e.data);
            }
        }
        mediaRec.start(100);
    } catch(err) {
        console.error("Error: " + err);
    }
};

function startReceive(){
    let videoElem = document.querySelector('.displayVideo');
    let mediaSource = new MediaSource();
    let arrayOfBlobs = [];
    let sourceBuffer = null;
    videoElem.src = URL.createObjectURL(mediaSource);

    mediaSource.onsourceopen = function(){
        sourceBuffer = this.addSourceBuffer('video/webm;codecs=vp8');
    }

    wsconnection.onmessage = function(e){
        var reader = new FileReader();
        reader.onload = function(e) {
            sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
            reader.onload = null;
        }
        reader.readAsArrayBuffer(e.data);
    }
}