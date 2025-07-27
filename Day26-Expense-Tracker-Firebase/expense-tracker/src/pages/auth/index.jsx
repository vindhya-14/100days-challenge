import { useNavigate, Navigate } from "react-router-dom";
import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { FcGoogle } from "react-icons/fc";
import { FaWallet, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

export const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();

  const signInWithGoogle = async () => {
    try {
      const results = await signInWithPopup(auth, provider);
      const authInfo = {
        userID: results.user.uid,
        name: results.user.displayName,
        profilePhoto: results.user.photoURL,
        isAuth: true,
      };
      localStorage.setItem("auth", JSON.stringify(authInfo));
      navigate("/expense-tracker");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  if (isAuth) {
    return <Navigate to="/expense-tracker" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md"
      >
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Expense Tracker Pro</h1>
          <p className="text-indigo-100 mt-2">Take control of your finances</p>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaWallet className="text-indigo-600 text-4xl" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Sign in to access your expense tracker dashboard
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg py-3 px-4 shadow-sm hover:bg-gray-50 transition"
          >
            <FcGoogle className="text-xl" />
            <span className="font-medium text-gray-700">Continue with Google</span>
          </motion.button>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2">
              <FaChartLine className="text-indigo-500" />
              <p className="text-sm text-gray-600">
                Track expenses • Analyze spending • Achieve goals
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature highlights - only shown on larger screens */}
      <div className="hidden lg:block ml-12 max-w-md">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg"
        >
          <h3 className="text-2xl font-bold text-indigo-700 mb-6">
            Why use Expense Tracker Pro?
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Easy Tracking</h4>
                <p className="text-gray-600 mt-1">
                  Quickly log expenses and income with just a few taps.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Visual Reports</h4>
                <p className="text-gray-600 mt-1">
                  Beautiful charts help you understand your spending patterns.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Budget Goals</h4>
                <p className="text-gray-600 mt-1">
                  Set and track financial goals to improve your savings.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};