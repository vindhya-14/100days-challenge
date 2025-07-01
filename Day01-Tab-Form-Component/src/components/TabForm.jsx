import { useState } from "react";
import Interests from "./Interests";
import Profile from "./Profile";
import Settings from "./settings";


const  TabForm  = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState({
    name: "Vindhya",
    age: 21,
    email: "vindhya@gmail.com",
    interests: ["coding", "reading"],
    theme: "dark",
  });
  const [errors, setErrors] = useState({});
  const tabs = [
    {
      name: "Profile",
      component: Profile,
      validate: () => {
        const err = {};
        if (!data.name || data.name.length < 2) {
          err.name = "Name is not valid";
        }
        if (!data.age || data.age < 18) {
          err.age = "Age is not valid";
        }
        if (!data.email || data.email.length < 2) {
          err.email = "Email is not valid";
        }

        setErrors(err);

        return err.name || err.age || err.email ? false : true;
      },
    },
    {
      name: "Interest",
      component: Interests,
      validate: () => {
        const err = {};
        if (data.interests.length < 1) {
          err.interests = "Select atleast one option";
        }
        setErrors(err);
        return err.interests ? false : true;
      },
    },
    {
      name: "Settings",
      component: Settings,
    },
  ];
  const ActiveComponent = tabs[activeTab].component;
  const handlePrevClick = () => {
    if (tabs[activeTab].validate()) {
      setActiveTab((prev) => prev - 1);
    }
  };
  const handleNextClick = () => {
    if (tabs[activeTab].validate()) {
      setActiveTab((prev) => prev + 1);
    }
  };
  const handleSubmitClick = () => {
    console.log("submit");
  };

  return (
    <div>
      <div className="heading-container">
        {tabs.map((t, index) => (
          <>
            <div
              className="heading"
              key={index}
              onClick={() => setActiveTab(index)}
            >
              {t.name}
            </div>
          </>
        ))}
      </div>
      <div className="tab-body">
        <ActiveComponent data={data} setData={setData} errors={errors} />
      </div>
      <div>
        {activeTab > 0 && <button onClick={handlePrevClick}>Previous</button>}
        {activeTab < tabs.length - 1 && (
          <button onClick={handleNextClick}>Next</button>
        )}
        {activeTab == tabs.length - 1 && (
          <button onClick={handleSubmitClick}>Submit</button>
        )}
      </div>
    </div>
  );
};


export default TabForm;