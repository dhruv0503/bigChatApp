import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Home = () => {
  return (
    <AppLayout
      WrappedContent={() => {
        return <div>Home</div>;
      }}
    />
  );
};

export default Home;
