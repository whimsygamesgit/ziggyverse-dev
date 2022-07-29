async function initWalletConnect(data){
    await initWallet();
}

async function onWalletConnect(data){
    return await onConnect(data)
}
