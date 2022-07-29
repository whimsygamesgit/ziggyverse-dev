async function InitLoadFileModule(){
    console.log("InitLoadFileModule");
}

function openFile() {
    if (!document.getElementById('FileUploadingPluginInput'))
        init();

    document.addEventListener("mouseup", openFileDialog, { once: true });
}

function init() {
    var inputFile = document.createElement('input');
    inputFile.setAttribute('type', 'file');
    inputFile.setAttribute('id', 'FileUploadingPluginInput');
    inputFile.setAttribute('accept', 'image/*'); //or accept="audio/mp3"
    inputFile.style.visibility = 'hidden';

    inputFile.onclick = function (event) {
        this.value = null;
    };

    inputFile.onchange = function (evt) {
        //process file
        console.log("log 4");
        evt.stopPropagation();
        var fileInput = evt.target.files;
        if (!fileInput || !fileInput.length) {
            return; // "no image selected"
        }
        var picURL = window.URL.createObjectURL(fileInput[0]);

        //do something with pic url
        const reader = new FileReader(picURL); //fileInput[0]
        reader.addEventListener("load", function () {
            var realData = reader.result;
            var allParts = Math.ceil(realData.length / 2000000);
            var maxPartSize = 2000000;
            var partSize = 0;
            var partNum = 0;
            var sent = 0;

            do {
                partSize = realData.length - sent;
                if (partSize > maxPartSize) {
                    partSize = maxPartSize;
                }
                partNum = partNum + 1;
                var sendBlock = realData.substring(sent, sent + partSize);
                sent = sent + partSize;
                console.log(sendBlock);
                var data = JSON.stringify({ partsCount: allParts, partNum: partNum, name: fileInput[0].name, bodyBase64: sendBlock });
                return  data;
            }
            while (sent < realData.length)
        }, false);


        reader.readAsDataURL(fileInput[0]);
    }

    document.body.appendChild(inputFile);
}
function openFileDialog() {
    document.getElementById('FileUploadingPluginInput').click();
}
