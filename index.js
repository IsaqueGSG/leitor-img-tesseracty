

navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}})
.then(function (mediaStream) {
    const video = document.querySelector('#video');
    video.srcObject = mediaStream;
    video.play();
})
.catch(function (err) {
    console.log('Não há permissões para acessar a webcam')
})

var gray;
var contraste;
function toggle(){
    const btnToggle = document.getElementById('btnToggle');

    if(btnToggle.textContent == 'colorido'){
        gray = '1'
        contraste = 1000
        btnToggle.textContent = 'preto e branco'
    }else if(btnToggle.textContent == 'preto e branco'){
        gray = '0'
        contraste = 100
        btnToggle.textContent = 'colorido'
    }
}

function captura_foto() {
    var canvas = document.querySelector("#canvas");  
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    canvas.style.filter = `grayscale(${gray}) contrast(${contraste}%)`
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    var dataurl = canvas.toDataURL('image/png');

    //TRANSFORMANDO DATAURL EM FILE
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "filename", {type:mime});
}

async function lerImg(file = captura_foto()){
    const spin = document.querySelector('#spin');
    spin.style.visibility = 'visible'

    const worker = await Tesseract.createWorker({
        logger: m => console.log(m)
    });
    await worker.loadLanguage('eng+por');
    await worker.initialize('eng+por');
    
    await worker.setParameters({ tessedit_char_whitelist: '0123456789+-'});
    const { data: { text } } = await worker.recognize(file);
    console.log(text);
    document.querySelector("#saida").textContent = text
    await worker.terminate();
    
    spin.style.visibility = 'hidden'
}
