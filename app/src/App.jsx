import { useEffect } from "react";

const USERS_API = `http://localhost:${process.env.REACT_APP_USERS_API}`;

const App = () => {
  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log(USERS_API);
        const resp = await fetch(USERS_API).then((r) => r.json());
        console.log({ resp });
      } catch (error) {
        console.log("Error in API Call ", error);
      }
    };
    testAPI();
  }, []);

  return <h1>App is Running...</h1>;
};

export default App;
