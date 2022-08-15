"use strict";
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

let web3Modal // Web3modal instance
let provider; // Chosen wallet provider given by the dialog window
let selectedAccount;// Address of the selected account
let rawMessage;

async function initWallet() {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider, // required
            options: {
                infuraId: "3998064f5a974362ae3d661234c65ea7" // required //TODO its only test id, need real
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });    
}

async function onConnect(data) {
    rawMessage = data;
    
    try {
        provider = await web3Modal.connect();
       
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }
    
    await provider.enable();
    
    return await fetchAccountData(provider);
    
    // // Subscribe to accounts change
    // provider.on("accountsChanged", (accounts) => {
    //     fetchAccountData();
    // });
    //
    // // Subscribe to chainId change
    // provider.on("chainChanged", (chainId) => {
    //    fetchAccountData();
    // });

    
    //await refreshAccountData();
}

async function fetchAccountData() {

    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);
    
    const accounts = await web3.eth.getAccounts();
    
    selectedAccount = accounts[0];  
    let signedMessage; //todo return this to unity
    const signer =  new ethers.providers.Web3Provider(web3.currentProvider).getSigner();
    const address = await signer.getAddress();

   signedMessage = await provider.send(
       'personal_sign',
       [ ethers.utils.hexlify(ethers.utils.toUtf8Bytes(rawMessage)), address.toLowerCase() ]
   );

   return JSON.stringify({address: address, signature: signedMessage.result});
    // const verified = ethers.utils.verifyMessage(rawMessage, signedMessage);
    // console.log("verified", verified);
}

// /**
//  * Fetch account data for UI when
//  * - User switches accounts in wallet
//  * - User switches networks in wallet
//  * - User connects wallet initially
//  */
async function refreshAccountData() {

    await fetchAccountData(provider);
}
