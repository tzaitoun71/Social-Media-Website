import "./Homepage.css";
import { Sidenav } from "./navigation/Sidenav";
import { Timeline } from "./timeline/Timeline";
import { Modal, styled, Button, Input } from "@mui/material";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, User as FirebaseUser, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useUserContext } from "./UserContext";
import { doc, getFirestore, setDoc } from "firebase/firestore";

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

export const Homepage = () => {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<FirebaseUser | null>(null)
    const [openSignIn, setOpenSignIn] = useState(false);
    const { updateUser } = useUserContext();
    const auth = getAuth();
    const firestore = getFirestore();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
                if (!authUser.displayName && username !== '') {
                    updateProfile(authUser, { displayName: username })
                        .then(() => {
                            alert(authUser.displayName + " " + authUser.email);
                        })
                        .catch((error) => {
                            console.error("Error updating display name:", error);
                        });
                }
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [auth, username]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);


    const signUp = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                const userProfile = {
                    uid: user.uid,
                    username: username,
                    email: email,
                };

                const userProfileRef = doc(firestore, 'userProfiles', user.uid);

                setDoc(userProfileRef, userProfile)
                    .then(() => {
                        updateUser(user);
                        localStorage.setItem("user", JSON.stringify(user));
                        setOpen(false);
                    })
                    .catch((error) => {
                        console.error("Error updating user profile:", error);
                        alert("An error occurred while creating your account. Please try again.");
                    });
            })
            .catch((error) => alert(error.message));
    }



    const signIn = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateUser(user);
                localStorage.setItem("user", JSON.stringify(user));
            })
            .catch((error) => alert(error.message))

        setOpenSignIn(false);
    }

    return (
        <div className="homepage">
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <Paper className="homepage__authorization">
                    <form className="homepage__signupModal">
                        <center>
                            <img
                                className="app__headerImage"
                                height="40px;"
                                src="https://firebasestorage.googleapis.com/v0/b/social-media-website-44b4e.appspot.com/o/logos%2Flogo.png?alt=media&token=46a841b8-edee-48bf-91ea-ad91aeb77adf"
                                alt=""
                            />
                        </center>
                        <Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            placeholder="Email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={signUp}>Sign Up</Button>
                    </form>
                </Paper>
            </Modal>
            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <Paper>
                    <form className="homepage__signinModal">
                        <center>
                            <img
                                className="app__headerImage"
                                src="https://firebasestorage.googleapis.com/v0/b/social-media-website-44b4e.appspot.com/o/logos%2Flogo.png?alt=media&token=46a841b8-edee-48bf-91ea-ad91aeb77adf"
                                height="40px"
                                alt=""
                            />
                        </center>

                        <Input
                            placeholder="Email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={signIn}>Sign In</Button>
                    </form>
                </Paper>
            </Modal>
            <div className="homepage_nav">
                <Sidenav />
                <div className="homepage__authorizationButton">
                    {!user && (
                        <div className="homepage__signin">
                            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        </div>
                    )}

                    {!user && (
                        <div className="homepage__signup">
                            <Button onClick={() => setOpen(true)}>Sign Up</Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="homepage_timeline">
                <Timeline user={user} />
            </div>
        </div>
    );
}