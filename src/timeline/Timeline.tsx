import "./Timeline.css";
import { Post } from "../posts/Post";
import { useEffect, useState } from "react";
import { db } from "../Firebase";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

interface Post {
  username: string;
  caption: string;
  imageUrl: string;
}

interface PostWithId extends Post {
  id: string;
}

interface TimelineProps {
  user: FirebaseUser | null;
}

export const Timeline = ({ user }: TimelineProps) => {
  const [posts, setPosts] = useState<PostWithId[]>([]);

  useEffect(() => {
    const postsCollectionRef = collection(db, "posts");
    const postsQuery = query(postsCollectionRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const newPosts: PostWithId[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as Post,
      }));
      setPosts(newPosts);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="timeline">
      <div className="timeline__left">
        <div className="timeline__posts">
          {posts.map((post) => (
            <Post key={post.id} user={user !== null ? user : null} postId={post.id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))}
        </div>
      </div>
    </div>
  );
};
