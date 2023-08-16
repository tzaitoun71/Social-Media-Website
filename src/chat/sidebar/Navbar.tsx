import { Avatar } from "@mui/material";
import '../ChatStyle.css'
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../UserContext";

export const NavBar = () => {
    const { user } = useUserContext();
    let userInitial = '';
    if (user?.displayName) {
        userInitial = user?.displayName[0];
    }

    const navigate = useNavigate();
    const avatarStyle = {
        width: '30px',
        height: '30px',
      };

    return (
        <div className="navbar">
            <span className="navbar__name">Olivegram</span>
            <div className="navbar__user">
                <Avatar className="navbar__avatar" style={avatarStyle} alt={user?.displayName || ''}>{userInitial}</Avatar>
                <span>{user?.displayName}</span>
                <button className="navbar__home" onClick={() => navigate('/')}> <Home className="navbar__homeLogo"/> </button>
            </div>
        </div>
    );
}