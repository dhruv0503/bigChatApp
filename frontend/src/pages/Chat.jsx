import React from "react";
import AppLayout from "../components/layout/AppLayout";

const Chat = () => {
  return (
    <AppLayout
      WrappedContent={() => {
        return <div>Chat</div>;
      }}
    />
  );
};

export default Chat;
