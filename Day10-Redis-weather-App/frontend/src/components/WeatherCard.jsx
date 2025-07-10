const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const { temp_c } = weather.current;
  const { text: description, icon } = weather.current.condition;
  const { name, region, country, localtime } = weather.location;

  return (
    <div style={{
      padding: "20px",
      borderRadius: "12px",
      background: "#f0f8ff",
      maxWidth: "320px",
      margin: "20px auto",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}>
      <h2 style={{ marginBottom: "10px" }}>{name}, {region}, {country}</h2>
      <p><strong>Local Time:</strong> {localtime}</p>
      <p><strong>Temperature:</strong> {temp_c}°C</p>
      <p><strong>Condition:</strong> {description}</p>
      <img src={`https:${icon}`} alt={description} style={{ width: "80px", height: "80px" }} />
    </div>
  );
};

export default WeatherCard;
