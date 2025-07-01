

const Interests = ({ data, setData, errors }) => {
  const { interests } = data;
  const handleChange = (e, name) => {
    setData((prevData) => ({
      ...prevData,
      interests: e.target.checked
        ? [...prevData.interests, e.target.name]
        : prevData.interests.filter((i) => i !== e.target.name),
    }));
  };
  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            name="coding"
            checked={interests.includes("coding")}
            onChange={handleChange}
          />
          Coding
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="coding"
            checked={interests.includes("music")}
            onChange={handleChange}
          />
          Music
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="coding"
            checked={interests.includes("reading")}
            onChange={handleChange}
          />
          Reading
        </label>
      </div>
      {errors.interests && <span className="error">{errors.interests}</span>}
    </div>
  );
};

export default Interests;