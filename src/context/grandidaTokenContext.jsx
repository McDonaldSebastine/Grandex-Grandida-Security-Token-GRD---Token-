import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const grandidaTokenContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () =>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;

}

export const TransactionProvider = ({ children })=>{

    const [ currentAccount, setCurrentAccount ] = useState('');
    const [formData, setFormData] = useState({addressTo:'', amount:'', keyword:'', message:''});
    const [ transactions, setTransactions ] = useState([]);
    
    const handleChange = (e, name) => {
        setFormData((prevState)=>({...prevState, [name]: e.target.value}));
        console.log(formData)
    }

    const getAllTransactions = async () =>{
        try {
            if(!ethereum) return alert('Please install metamask');
            const transactionContract = getEthereumContract();

            const availableTransactions = await transactionContract.getAllTransactions();
            console.log(availableTransactions);
            // const structuredTransactions = availableTransactions.map((transaction)=>({
            //   addressTo: transaction.receiver,
            //   addressFrom: transaction.sender,
            //   timestamp: new Date(transaction.timestamp.toNumber()*1000).toLocaleString(),
            //   message: transaction.message,
            //   keyword: transaction.keyword,
            //   amount: parseInt(transaction.amount._hex)/(10**18) 
            // }));

            console.log(structuredTransactions);

            setTransactions(structuredTransactions);
        } catch (error) {
            console.log(error);
        }
    }


    const checkIfWalletIsConnected = async () =>{
        try {
          
            if(!ethereum) return alert('Please install metamask'); 

            const accounts = await ethereum.request({method: 'eth_accounts'});
    
            if (accounts.length){
                setCurrentAccount(accounts[0]);
    
                getAllTransactions();
            } else {
                console.log('No accounts found')
            }  
        } catch (error) {
            console.log(error);

            throw new Error('No ethereum object.');
        }

    }



    const connectWallet = async () => {
  
        try{
            if(!ethereum) return alert('Please install metamask');

            const accounts = await ethereum.request({method: 'eth_requestAccounts'});

            setCurrentAccount(accounts[0]);
        } catch (error){ 
            console.log(error); 

            throw new Error('No ethereum object.');
        }
    }

    const sendTransaction = async () =>{

        try {
            if(!ethereum) return alert('Please install metamask');

            const { addressTo, amount, keyword, message } = formData;
            
            const transactionContract = getEthereumContract();

            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params:[{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', 
                    value: parsedAmount._hex, 
                }]
            });

          
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
      
            await transactionHash.wait();
       
        }   catch (error) {
            console.log(error);
            throw new Error('No ethereum object.'); 
        }

    }

   
    useEffect(()=>{
        checkIfWalletIsConnected();

    }, []);

    return (
        <TransactionContext.Provider value={{ 
            connectWallet, 
            currentAccount, 
            handleChange, 
            sendTransaction, 
            transactions, 
            }}>
            {children}
        </TransactionContext.Provider>
    );
}

