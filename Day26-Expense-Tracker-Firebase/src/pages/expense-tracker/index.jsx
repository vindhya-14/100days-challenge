import { useState } from "react";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";

export const ExpenseTracker = () => {
    const {addTransaction} = useAddTransaction();
    const {transactions , transactionTotals} = useGetTransactions();
    const {name , profilePhoto} = useGetUserInfo();
    const [description,setDescription] = useState("");
    const navigate = useNavigate();
    const [transactionAmount,setTransactionAmount] = useState(0);
    const [transactionType,setTransactiontype] = useState("expense");

    const {balance,income,
       expenses } = transactionTotals;
    const onSubmit = (e) => {
        e.preventDefault();
        addTransaction (
            {
                description,
                transactionAmount,
                transactionType,
            }
        );

        setDescription("")
        setTransactionAmount(0)
    }
    

    const signUserOut = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            navigate('/')
        } catch (error) {
            console.log(error);
        }
        
    }
    return(
        <>
     <div className="expense-tracker">
        <div className="container">
         <h1> {name}'s Expense Tracker</h1>
         <div className="balance">
         <h3>Your Balance</h3>
         {
            balance >= 0 ? (
               <h2>${balance}</h2> 
            ) : (
                <h2>- ${balance}</h2>
            )
         }
         

         </div>
         <div className="summary">
            <div className="income">
                <h4>Income</h4>
                <p>${income}</p>
            </div>

            <div className="expenses">
              <h4>Expenses</h4>
              <p>${expenses}</p>
            </div>
         </div>
         <form className="add-transaction" onSubmit={onSubmit}>
        <input type="text" placeholder="Description" value={description}required onChange={(e) => setDescription(e.target.value)}/>
        <input type="number" placeholder="Amount"  value={transactionAmount} required onChange={(e) => setTransactionAmount(e.target.value)}/>
        <input type="radio" id="expense" value="expense" checked={transactionType === "expense"} onChange={(e) => setTransactiontype(e.target.value)}   />
        <label htmlFor="expense">Expense</label>
        <input type="radio" id="income" value="income" checked={transactionType === "income"} onChange={(e) => setTransactiontype(e.target.value)}   />
        <label htmlFor="income">Income</label>
        <button type="submit">Add Transaction</button>
         </form>
        </div>
        </div>
        {profilePhoto && <div className="profile"> <img className="profile-photo" alt="profile-photo" src={profilePhoto} />
          <button className="sign-out-button" onClick={signUserOut}>
            Sign Out
          </button>
        
         </div>}
        <div className="transactions">
           <h3>Transactions</h3>
           <ul>
            {transactions.map((transaction) => {
                const {description,transactionAmount,transactionType} = transaction;


                return (
                    <li>
                        <h4>{description}</h4>
                        <p>${transactionAmount} . <label style={{color: transactionType === "expense" ? "red" : "green"}}>{transactionType}</label> </p>
                    </li>

                );
            })}
           </ul>
        </div>
        </>
    );    
};