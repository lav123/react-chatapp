import React, { useEffect, useRef } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
// import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
// import AttachFileIcon from "@material-ui/icons/AttachFile";
// import MoreVertIcon from "@material-ui/icons/MoreVert";
// import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CameraIcon from "@material-ui/icons/Camera";
import MicIcon from "@material-ui/icons/Mic";
import { useLocation } from "react-router-dom";
import db, { storage } from "./../firebase";
import firebase from "firebase";
import { useStateValue } from "../StateProvider";
import Webcam from "react-webcam";
import { v4 as uuid } from "uuid";
const videoConstraints = {
  width: 550,
  height: 400,
  facingMode: "user",
};
function Chat() {
  const [open, setOpen] = React.useState(false);
  const [seed, setSeed] = React.useState("");
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [roomName, setRoomName] = React.useState("");
  const [{ user }, dispatch] = useStateValue();
  const location = useLocation();
  const webcamRef = useRef(null);
  const [image, setImage] = React.useState(null);
  const messagesEndRef = useRef(null);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const id = uuid();
    const uploadTask = storage
      .ref(`posts/${id}`)
      .putString(imageSrc, "data_url");
    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("posts")
          .child(id)
          .getDownloadURL()
          .then((url) => {
            // console.log("URL: " + url);
            setImage(url);
            db.collection("rooms").doc(roomId).collection("messages").add({
              message: null,
              name: user.displayName,
              imageUrl: url,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
          });
      }
    );
    setOpen(false);
  }, [webcamRef]);
  const scrollToBottom = () => {
    console.log(messagesEndRef);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  let roomId = location.pathname.split("/rooms/", 2)[1];

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
    scrollToBottom();
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(`You Typed>>>> ${input}`);
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };
  const captureImage = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toLocaleString()}
          </p>
        </div>
        {/* <div className="chat_headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div> */}
      </div>
      <div className="chat_body" ref={messagesEndRef}>
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.name === user.displayName && "chat_reciever"
            }`}
            key={Math.random()}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Message"
                width="120"
                height="120"
              />
            )}
            <span className="chat_time">
              {new Date(message.timestamp?.toDate()).toLocaleString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <IconButton onClick={() => captureImage()}>
          <CameraIcon />
        </IconButton>
        <form>
          <input
            type="text"
            value={input}
            placeholder="type a message"
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage} type="submit">
            Send Message
          </button>
        </form>
        <MicIcon />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogContent>
          <Webcam
            height={videoConstraints.height}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={videoConstraints.width}
            videoConstraints={videoConstraints}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={capture} color="primary">
            Capture and Send Image
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Chat;
