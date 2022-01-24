import React, {useState} from "react";
import { ethers } from "ethers";
import SimpleStore_abi from './contracts/SimpleStore_abi.json';

const SimpleStore = () => {

    const contractAddress = '0x0060942fA687Cd347006C14223c92C9a94F97881'
    
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connectButtonText, setConnButtonText] = useState('Connect Wallet');

    const [currentContractVal, setCurrentContractVal] = useState('example value');
    
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    // checks if ethereum is present in the window, 
    // if it is, returns MetaMask account and request to connect to it
    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({method:'eth_requestAccounts'})
            .then(result => {
                accountChangeHandler(result[0])
                setConnButtonText('Wallet Connected')
            })
        } else {
            setErrorMessage('Need to install MetaMask')
        }
    }

    // setting state for the MetaMask account
    const accountChangeHandler = (newAccount) => {
        setDefaultAccount(newAccount)
        updateEthers()
    }

    const updateEthers = () => {
        // ethers provider MetaMask-- readonly
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(tempProvider)

        // turns read-only to read and write
        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner)

        // SimpleStore_abi = JSON definition file  of the contract
        // tempSigner to enable read and write on the contract
        let tempContract = new ethers.Contract(contractAddress, SimpleStore_abi, tempSigner)
        setContract(tempContract)
    }

    // returns storedData
    const getCurrentVal = async () => {
        let val = await contract.get()
        setCurrentContractVal(val)
    }

    const setHandler = (event) => {
        event.preventDefault()
        contract.set(event.target.setText.value)
    }
    
    return (
        <div className="container">
            <h1 className="title">Simple DApp</h1>
            <button className="connectButton" onClick={connectWalletHandler}>
                {connectButtonText}
            </button>

            <div className="contentContainer"> 
                <div className="contractAddress">
                    <h3> Contract Address: </h3>
                    <div className="bodyText">{defaultAccount} </div>
                </div>
                <div className="setContract">
                    <h3>Set Contract:</h3>
                    <form onSubmit={setHandler}>
                        <input id="setText" type="text"/>
                        <button type="submit">Update</button>
                    </form>
                </div>
                <div className="currentValue">
                    <h3>Current Contract Value:</h3>
                    <div className="bodyText">{currentContractVal}</div>
                    <button onClick={getCurrentVal}>Get Current Value</button>
                </div>
                <div className="errorMessage">
                    {errorMessage}
                </div>
            </div>
    </div>
    )
}

export default SimpleStore;