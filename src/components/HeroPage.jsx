import React, { useContext } from 'react';
import { grandidaTokenContext } from "../context/grandidaTokenContext";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { SiEthereum } from "react-icons/si";





const Input = ({placeholder, name, type, value, handleChange}) =>(
    <input placeholder={placeholder} type={type} step='0.0001' value={value} 
    onChange={(e)=> handleChange(e, name)} 
    />
);

const HeroPage = () => {
    const { connectWallet, currentAccount, sendTransaction, handleChange, transactions} = useContext(TransactionContext);

    const handleSubmit = (e) =>{
    
        e.preventDefault();

       sendTransaction();
    
    }

    return(
        <Section>
            <div className='head'>
                <img src={logo} alt='logo' style={{width:80, height:50}}></img>
                {currentAccount?
                (<div className='block'><SiEthereum/>{currentAccount.slice(0,10)}...</div>):
                (<button className='btn1' onClick={connectWallet}>Connect Wallet</button>)
                }<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <div className='container'>

                    <div className='right'>
                        <h1 style={{color:'white',fontFamily:"cursive"}}>Ethereum Transactions</h1>
                        <div className='form'>
                           
                            <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange}/>
                            <Input placeholder="Amount (ETH)"  name="amount" type="number" handleChange={handleChange}/>
                            <Input placeholder="Keyword" name="keyword" type="text" handleChange={handleChange}/>
                            <Input placeholder="Enter Message" name="message" type="text" handleChange={handleChange}/>
                            <button className='btn2' onClick={handleSubmit}>Send</button>
                        </div>
                    </div>
                    <div className='left'>
                        {transactions.map((transaction)=>{
                            return(
                                <div className='list'>
                                    <p>{transaction.addressFrom.slice(0,30)}</p>
                                    <p>{transaction.addressTo.slice(0,30)}</p>
                                    <p>{transaction.timestamp}</p>
                                    <p>{transaction.message}</p>
                                    <div className='divider'></div>
                                </div>
                            )
                        })}
                    </div><br/>
                </div>
            </div>
        </Section>
    );
}

export default HeroPage;

const Section = styled.section`
    *{
        margin:0;
        padding:0;
        box-sizing:border-box;
    }
    .head{
        width:100vw;
        height:1000px;
        background:linear-gradient(#1abc9c,#1abc9c),url(https://builtin.com/sites/www.builtin.com/files/styles/og/public/2022-09/blockchain.png);
        background-size:100% 40%, 100% 100%;
        background-position:bottom,center;
        background-repeat: no-repeat, no-repeat;
        .btn1{
            float:right;
            width:150px;
            margin-right:250px;
            margin-top:10px;
            padding: 10px 24px;
            text-align:center;
            border:none;
            border-radius:10px;
            background-color:orange;
            cursor:pointer;
        }
        img{
            margin-top:10px;
            margin-left:30px;  
        }
    }

    .block{
        float:right;
        width:180px;
        margin-right:250px;
        margin-top:10px;
        padding: 10px 24px;
        text-align:center;
        border:none;
        border-radius:10px;
        background-color:orange;
        cursor:pointer;
        color:purple;
        font-weight:bold;
        display:flex;
    }

    .container{
        width:100%;
        display:flex;
        justify-content: center;
        align-items: center;
        flex-direction:column;
    }

    .left{
        flex-basis:50%;
        color:black;
        margin-top:50px;
        width:700px;
        text-align:center;
        background-color:white;
        overflow-y:scroll;
        max-height:300px;
        p{
            font-weight:bold;
            color:orange;
            font-family:cursive;
        }
    }

    .right{
        flex-basis:50%;
        h1{
            text-align:center;
        }
    }
    .divider{
        height:2px;
        background:linear-gradient(#1abc9c,#1abc9c);
        width:600px;
        margin-left:30px;
        text-align:center;
    }

    .form{
        background: rgba(255,255,255,0.2);
        width:50%;
        height:300px;
        margin-top:140px;
        margin:auto;
        padding:30px 20px;
        color:white;
    }
    Input[type="text"]{
        padding:10px;
        border:none;
        margin:10px 20px;
        width:70%;
    }
    Input[type="number"]{
        padding:10px;
        border:none;
        margin:10px 20px;
        width:70%;
    }
    .btn2{
        margin:10px 20px;
        padding: 10px 24px;
        text-align:center;
        border:none;
        border-radius:10px;
        background-color:orange;
        cursor:pointer;
        width:80px;
    }
    .counter{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding-top:100px;
        h1{
            color:black;
        }
    }
    .left h1{
        text-align:right;
        letter-spacing:5px;
        color:black;
    }

    @media screen and (min-width: 280px) and (max-width: 1080px) {
        .head{
            display:flex;
            flex-direction:column;
            padding-left:20px;
        }
        .right{
            position:absolute;
        }

        .left{
           margin-top:800px;
        }
        .list{
            padding-left:10px;
            padding-right:10px;
        }
    }

`