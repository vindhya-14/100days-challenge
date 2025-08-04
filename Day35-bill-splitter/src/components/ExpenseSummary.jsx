import { motion } from 'framer-motion';
import { FiPieChart, FiUser, FiDollarSign, FiArrowRight } from 'react-icons/fi';

export default function ExpenseSummary({ participants, expenses }) {
  // Calculate totals and splits
  const total = expenses.reduce((acc, cur) => acc + cur.amount, 0);
  const split = participants.length ? total / participants.length : 0;

  // Calculate summary for each participant
  const summary = participants.map((p) => {
    const paid = expenses
      .filter((e) => e.payer === p)
      .reduce((acc, cur) => acc + cur.amount, 0);
    return { 
      name: p, 
      paid, 
      owes: split - paid,
      color: `hsl(${Math.random() * 360}, 70%, 70%)` // Random color for each participant
    };
  });

  // Calculate who owes whom
  const calculateTransactions = () => {
    const debtors = summary.filter(p => p.owes > 0);
    const creditors = summary.filter(p => p.owes < 0);
    
    const transactions = [];
    
    debtors.forEach(debtor => {
      let remainingDebt = debtor.owes;
      
      creditors.forEach(creditor => {
        if (remainingDebt <= 0) return;
        
        const creditorAvailable = Math.abs(creditor.owes);
        const amount = Math.min(remainingDebt, creditorAvailable);
        
        if (amount > 0.01) { // Ignore tiny amounts
          transactions.push({
            from: debtor.name,
            to: creditor.name,
            amount: parseFloat(amount.toFixed(2)),
            fromColor: debtor.color,
            toColor: creditor.color
          });
          
          remainingDebt -= amount;
          creditor.owes += amount;
        }
      });
    });
    
    return transactions;
  };

  const transactions = calculateTransactions();

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <FiPieChart className="text-2xl text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">Expense Summary</h2>
      </div>

      {/* Totals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <FiUser />
            <span className="font-medium">Participants</span>
          </div>
          <div className="text-2xl font-bold">{participants.length}</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <FiDollarSign />
            <span className="font-medium">Total Expenses</span>
          </div>
          <div className="text-2xl font-bold">₹{total.toFixed(2)}</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <FiDollarSign />
            <span className="font-medium">Per Person</span>
          </div>
          <div className="text-2xl font-bold">₹{split.toFixed(2)}</div>
        </div>
      </div>

      {/* Individual Balances */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Individual Balances</h3>
        <div className="space-y-3">
          {summary.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ 
                background: s.owes > 0 
                  ? `linear-gradient(90deg, white ${100 - (s.owes/split)*100}%, ${s.color}20 ${100 - (s.owes/split)*100}%)`
                  : `linear-gradient(90deg, white ${100 - (Math.abs(s.owes)/split)*100}%, ${s.color}20 ${100 - (Math.abs(s.owes)/split)*100}%)`
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: s.color }}
                />
                <span className="font-medium">{s.name}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">Paid: ₹{s.paid.toFixed(2)}</div>
                <div className={s.owes > 0 ? "text-red-500" : "text-green-500"}>
                  {s.owes > 0 
                    ? `Owes ₹${s.owes.toFixed(2)}`
                    : `Gets ₹${Math.abs(s.owes).toFixed(2)}`}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Transactions Needed */}
      {transactions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Settlements Needed</h3>
          <div className="space-y-3">
            {transactions.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: t.fromColor }}
                  />
                  <span className="font-medium">{t.from}</span>
                </div>
                
                <div className="flex items-center gap-2 px-4">
                  <span className="text-red-500 font-medium">₹{t.amount.toFixed(2)}</span>
                  <FiArrowRight className="text-gray-400" />
                </div>
                
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: t.toColor }}
                  />
                  <span className="font-medium">{t.to}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {transactions.length === 0 && total > 0 && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
          All balances are settled! 🎉
        </div>
      )}
    </motion.div>
  );
}