async function initWalletConnect(data){
    await initWallet();
}

async function onWalletConnect(data){
    return await onConnect(data)
}

async function onSignTransaction(data){
    return await signTransaction(data)
}
