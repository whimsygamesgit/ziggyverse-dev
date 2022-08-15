function doSend (data){
    window.unityGame.SendMessage("BrowserService", "OnMessage", data);
}
