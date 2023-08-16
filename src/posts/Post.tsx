import { Avatar } from "@mui/material";
import "./Post.css";
import { useEffect, useState, FormEvent } from "react";
import { db } from "../Firebase";
import { User as FirebaseUser } from "firebase/auth";
import {
    collection,
    doc,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";

interface Comment {
    username: string;
    text: string;
}

interface CommentWithId extends Comment {
    id: string;
}

interface PostProps {
    username: string;
    imageUrl: string;
    caption: string;
    postId: string;
    user: FirebaseUser | null;
}

export const Post = (props: PostProps) => {
    const [comments, setComments] = useState<CommentWithId[]>([]);
    const [comment, setComment] = useState<string>("");

    const postComment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (comment.trim() === "") {
            return;
        }

        const newComment: Comment = {
            username: props.user?.displayName || props.username, // Use props.username if user is signed out
            text: comment.trim(),
        };

        try {
            const commentRef = collection(
                doc(db, "posts", props.postId),
                "comments"
            );
            await addDoc(commentRef, {
                ...newComment,
                timestamp: serverTimestamp(),
            });

            setComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(doc(db, "posts", props.postId), "comments"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => {
                const newComments: CommentWithId[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as CommentWithId[];
                setComments(newComments);
            }
        );

        return () => unsubscribe();
    }, [props.postId]);

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt={props.username}>{props.username[0]}</Avatar>
                <div>{props.username}</div>
            </div>
            <div className="post__image">
                <img
                    className="post__imageImg"
                    src={props.imageUrl}
                    alt="Post"
                />
            </div>
            <div className="post__footer">
                <strong>{props.username}</strong> {props.caption}
            </div>
            <div className="post__comments">
                {comments.map((comment) => (
                    <p key={comment.id}>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {props.user && (<form className="post__commentBox" onSubmit={postComment}>
                <input
                    className="post__input"
                    type="text"
                    placeholder={"Add a comment"}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                >
                    {"Post"}
                </button>
            </form>)}
        </div>
    );
};
