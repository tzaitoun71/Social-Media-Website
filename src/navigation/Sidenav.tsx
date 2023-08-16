import "./Sidenav.css"
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from "@mui/icons-material/Chat";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, Modal, styled } from "@mui/material";
import { useState } from "react";
import { CreatePost } from "./CreatePost";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";


function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const Paper = styled("div")(({ theme }) => ({
    ...getModalStyle(),
    position: "absolute",
    width: 400,
    backgroundColor: '#332E30',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
}));

export const Sidenav = () => {
    const [openUpload, setOpenUpload] = useState(false);
    const { user } = useUserContext();
    const isUserSignedIn = user !== null;
    const navigate = useNavigate();
    const { handleSignOut } = useUserContext();

    const handleHomeClick = () => {
        if (isUserSignedIn) {
            navigate('/');
        }
    };

    const handleMessagesClick = () => {
        if (isUserSignedIn) {
            navigate('/inbox');
        }
    };

    return (
        <div className="sidenav">
            <Modal
                open={openUpload}
                onClose={() => setOpenUpload(false)}
            >
                <Paper className="sidenav__uploadModal">
                    <CreatePost username={user?.displayName || ''} />
                </Paper>
            </Modal>
            <img
                className="sidenav__logo"
                src="https://firebasestorage.googleapis.com/v0/b/social-media-website-44b4e.appspot.com/o/logos%2Flogo.png?alt=media&token=46a841b8-edee-48bf-91ea-ad91aeb77adf"
                alt="Instagram Logo"
            />
            <div className="sidenav_buttons">
                <button className="sidenav__button" onClick={handleHomeClick}>
                    <HomeIcon />
                    <span>Home</span>
                </button>
                <button
                    className={`sidenav__button ${!isUserSignedIn ? "disabled" : ""}`}
                    onClick={handleMessagesClick}
                >
                    <ChatIcon />
                    <span>Messages</span>
                </button>
                <button className={`sidenav__button ${!isUserSignedIn ? "disabled" : ""}`} onClick={() => setOpenUpload(true)}>
                    <AddCircleOutlineIcon />
                    <span>Create</span>
                </button>
                {user && (
                    <div className="homepage__logout">
                        <Button onClick={handleSignOut}>Logout</Button>
                    </div>
                )}
            </div>
        </div>
    );
}