import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { PAGE_SIZE } from "./constants";
import Pagination from "./components/Pagination";


const App = () => {

  const [products,setProducts] = useState([]);
  const [currentPage,setCurrentPage] = useState(0);

const fetchData = async () => {
  try {
     const data = await fetch("https://dummyjson.com/products?limit=500");
      const json = await data.json();
      console.log(json.products);
      setProducts(json.products);
  } catch (error) {
    console.log(error);
  }
      
}

useEffect (() => {
  fetchData();
},[])
     

     const handleChange = (p) => {
          setCurrentPage(p);
     }

     const handleNext = () => {
         setCurrentPage((prev) => prev + 1)
     }
     
     const handlePrev = () => {
         setCurrentPage((prev) => prev - 1)
     }


     const total_products = products.length;
     const noOfPages = Math.ceil(total_products / PAGE_SIZE)
     const start = currentPage * PAGE_SIZE
     const  end = start + PAGE_SIZE
    

    return  !products.length ? (
      <h1>Products not found</h1>
    ) : (
    <div className="App">
    <Pagination
        currentPage={currentPage}
        handleChange={handleChange}
        handlePrev={handlePrev}
        handleNext={handleNext}
        noOfPages={noOfPages}
    />
    <div className="product-container">

    {products.slice(start,end).map((p) => (
        <ProductCard key={p.id} title={p.title} image={p.thumbnail} price={p.price} />
      ))
    }
    </div>
    

    </div>
    )
      

    
  


}

export default App;