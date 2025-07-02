const ProductCard = ({ image, title, price }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        margin: "10px",
        borderRadius: "10px",
        width: "250px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img
        src={image}
        alt={title}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <h2 style={{ fontSize: "18px", margin: "10px 0" }}>{title}</h2>
      <p style={{ color: "green", fontWeight: "bold" }}>${price}</p>
    </div>
  );
};

export default ProductCard;
