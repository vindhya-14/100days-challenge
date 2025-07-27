import { useState } from "react";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { FiLogOut, FiPlusCircle, FiFilter, FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";
import { format } from 'date-fns';

export const ExpenseTracker = () => {
    const { addTransaction } = useAddTransaction();
    const { transactions, transactionTotals } = useGetTransactions();
    const { name, profilePhoto } = useGetUserInfo();
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const [transactionAmount, setTransactionAmount] = useState("");
    const [transactionType, setTransactionType] = useState("expense");
    const [category, setCategory] = useState("food");
    const [filter, setFilter] = useState("all");
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const { balance, income, expenses } = transactionTotals;

    const categories = [
        { value: "food", label: "Food" },
        { value: "transport", label: "Transport" },
        { value: "housing", label: "Housing" },
        { value: "entertainment", label: "Entertainment" },
        { value: "shopping", label: "Shopping" },
        { value: "utilities", label: "Utilities" },
        { value: "other", label: "Other" },
    ];

    const onSubmit = (e) => {
        e.preventDefault();
        addTransaction({
            description,
            transactionAmount: Number(transactionAmount),
            transactionType,
            category,
            date
        });

        setDescription("");
        setTransactionAmount("");
        setTransactionType("expense");
        setCategory("food");
        setDate(format(new Date(), 'yyyy-MM-dd'));
    };

    const signUserOut = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === "all") return true;
        if (filter === "income") return transaction.transactionType === "income";
        return transaction.transactionType === "expense";
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-indigo-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{name}'s Expense Tracker</h1>
                    {profilePhoto && (
                        <div className="flex items-center space-x-4">
                            <img 
                                className="w-10 h-10 rounded-full object-cover border-2 border-white" 
                                alt="profile" 
                                src={profilePhoto} 
                            />
                            <button 
                                onClick={signUserOut}
                                className="flex items-center space-x-1 bg-white text-indigo-600 px-3 py-1 rounded-md hover:bg-gray-100 transition"
                            >
                                <FiLogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Balance and Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Balance Card */}
                    <div className={`bg-white rounded-lg shadow-md p-6 ${balance >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Your Balance</h3>
                        <h2 className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(balance)}
                        </h2>
                    </div>

                    {/* Income Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Income</h4>
                                <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(income)}</p>
                            </div>
                            <FiTrendingUp className="text-green-500" size={24} />
                        </div>
                    </div>

                    {/* Expenses Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Expenses</h4>
                                <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(expenses)}</p>
                            </div>
                            <FiTrendingDown className="text-red-500" size={24} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Transaction Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FiPlusCircle className="mr-2 text-indigo-600" />
                                Add Transaction
                            </h3>
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        id="description"
                                        placeholder="e.g. Groceries, Salary"
                                        value={description}
                                        required
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiDollarSign className="text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            id="amount"
                                            placeholder="0.00"
                                            value={transactionAmount}
                                            required
                                            onChange={(e) => setTransactionAmount(e.target.value)}
                                            className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        value={date}
                                        required
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                    <div className="flex space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                value="expense"
                                                checked={transactionType === "expense"}
                                                onChange={(e) => setTransactionType(e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-gray-700">Expense</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                value="income"
                                                checked={transactionType === "income"}
                                                onChange={(e) => setTransactionType(e.target.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-gray-700">Income</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
                                >
                                    <FiPlusCircle className="mr-2" />
                                    Add Transaction
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
                                <div className="flex items-center space-x-2">
                                    <FiFilter className="text-gray-500" />
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="all">All</option>
                                        <option value="income">Income</option>
                                        <option value="expense">Expenses</option>
                                    </select>
                                </div>
                            </div>

                            {filteredTransactions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No transactions found. Add your first transaction!
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredTransactions.map((transaction) => {
                                        const {
                                            id,
                                            description,
                                            transactionAmount,
                                            transactionType,
                                            category,
                                            date
                                        } = transaction;

                                        const categoryInfo = categories.find(cat => cat.value === category) || 
                                                           { label: "Other", value: "other" };

                                        return (
                                            <div 
                                                key={id} 
                                                className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-full ${transactionType === "income" ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        {transactionType === "income" ? (
                                                            <FiTrendingUp size={20} />
                                                        ) : (
                                                            <FiTrendingDown size={20} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{description}</h4>
                                                        <div className="flex space-x-2 mt-1">
                                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                                                {categoryInfo.label}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {format(new Date(date), 'MMM dd, yyyy')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`font-semibold ${transactionType === "income" ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transactionType === "income" ? '+' : '-'}{formatCurrency(transactionAmount)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};