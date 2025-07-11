import Dashboard from "./components/Dashboard";
import Login from "./components/Login";



const App = () => {
       
              
        const token = localStorage.getItem("token");

        return (

          <div>
            {
              token ? <Dashboard /> : <Login />
            }
          </div>

        );


       
}


export default App