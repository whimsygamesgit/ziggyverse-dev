"use strict";
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

let web3Modal // Web3modal instance
let provider; // Chosen wallet provider given by the dialog window
let selectedAccount;// Address of the selected account
let rawMessage;
let web3Provider;

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
        theme: {
            background: "rgba(24, 23, 56, 0.92)",
            main: "rgba(219, 220, 255, 1)",
            secondary: "rgba(185, 187, 238, 1)",
            border: "rgba(12, 11, 21, 0.8)",
            hover: "rgba(90, 88, 193, 0.4)"
        }
    });    
}

async function onConnect(data) {
    rawMessage = data;
    
    try {
        provider = await web3Modal.connect();
        web3Provider = new ethers.providers.Web3Provider(provider);
       
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return JSON.stringify({isError: true});
    }
    
    await provider.enable();

    web3Modal.clearCachedProvider();
    window.localStorage.clear();

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
    
    // let error;
    try{
        // Get a Web3 instance for the wallet
        const web3 = new Web3(provider);

        const accounts = await web3.eth.getAccounts();

        selectedAccount = accounts[0];
        let signedMessage;
        const signer =  new ethers.providers.Web3Provider(web3.currentProvider).getSigner();
        const address = await signer.getAddress();
        
        signedMessage = await provider.send(
            'personal_sign',
            [ ethers.utils.hexlify(ethers.utils.toUtf8Bytes(rawMessage)), address.toLowerCase() ]
        );
        let signedMessageToReturn;
        let walletType;

        if (typeof signedMessage === 'string' || signedMessage instanceof String)
        {
            signedMessageToReturn = signedMessage;
            walletType = 'WalletConnect';
        }
        else
        {
            signedMessageToReturn = signedMessage.result;
            walletType = 'Metamask';
        }

        return JSON.stringify({isError: false, address: address, signature: signedMessageToReturn, walletType: walletType});
        
    } catch (e) {
        
        // if(e.code == 4001)
        // {
        //     error = e.messageerror;
        //     console.log(error, e);           
        // }

        return JSON.stringify({isError: true});       
    }
   

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

async function signTransaction(data){    
    try{
        console.log(data);
        const tx = {
            from: data.from,
            to: data.to,
            nonce: data.nonce,
            gasLimit: data.gas_limit,
            gasPrice: data.gas_price,
            value: data.value,
            data: data.data,
        };
        let hash = await web3Provider.getSigner().sendUncheckedTransaction(tx);
        return JSON.stringify({hash: hash, isError: false});
    } catch (e) {
        console.log(e)
        return JSON.stringify({isError: true});
    }   
}
