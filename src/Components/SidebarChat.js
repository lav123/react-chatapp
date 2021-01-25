import React, { useEffect } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "./../firebase";
import { useHistory } from "react-router-dom";

function SidebarChat({ id, name, addnewChat }) {
  const [seed, setSeed] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const history = useHistory();

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const goTochatRoom = (Id) => {
    history.push("/rooms/" + Id);
  };
  const createChat = () => {
    const roomName = prompt(`please name for chat`);
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };
  return !addnewChat ? (
    <div className="sidebarChat" onClick={() => goTochatRoom(id)}>
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className="sidebarChat_info">
        <h2>{name}</h2>
        <p>{messages[0]?.message}</p>
      </div>
    </div>
  ) : (
    <div className="sidebarChat" onClick={createChat}>
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
