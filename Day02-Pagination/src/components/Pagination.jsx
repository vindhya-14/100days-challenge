
const Pagination = ({currentPage,handleChange,handlePrev,handleNext,noOfPages}) => 
{
    return <div className="pagination-container pagination-controls">
       <button

       disabled={currentPage == 0}
      onClick={() => handlePrev()}
      >◀️</button> 

      {

        [...Array(noOfPages).keys()].map((p) => (
          <button 
          className={"page-number" +   (p == currentPage ? "active" : "" )}
          key={p}
          onClick={() => handleChange(p)}
          disabled={currentPage == noOfPages - 1}
          >{p}</button>
        ))
      }

     
    <button
       disabled ={currentPage == 0}
       onClick={() => handleNext()}
       >▶️</button>
    </div>





}

export default Pagination;