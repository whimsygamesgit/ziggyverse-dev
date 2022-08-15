function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {

    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

async function invoke(data){
    console.log(data);
    let result = "";
    if(data.parameters !== undefined)
    {
        result = await window[data.functionName](data.parameters);
    }else{
        result = await window[data.functionName]();
    }
    doSend(data.id + ";" +result);
}

async function loadModule(parameters){
    try{
        parameters = JSON.parse(parameters);
        await loadScript(parameters.ModulePath);
        if(parameters.moduleData !== undefined){
            await window[parameters.InitJsFuncName](parameters.moduleData);
        } else {
            await window[parameters.InitJsFuncName]();
        }
        
    } catch (e) {
        console.log(e);
    }
}

async function loadScript(script_url){
    await new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.onload = resolve;
        script.src = script_url;
        document.head.appendChild(script);
    });
}

async function openNewTab(data){
    window.open(data.url);
    return "{}";
}
