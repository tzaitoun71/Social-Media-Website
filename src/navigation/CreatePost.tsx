import { useState } from "react";
import { Button } from "@mui/material";
import { storage, db } from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "firebase/firestore";
import "./CreatePost.css";
interface Username {
  username: string;
}

export const CreatePost: React.FC<Username> = ({ username }) => {
  const [image, setImage] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Image uploaded successfully!");
            console.log("Download URL:", downloadURL);

            const postsCollectionRef = collection(db, "posts");
            
            const postsQuery = query(postsCollectionRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(postsQuery);

            const posts = querySnapshot.docs.map((doc) => doc.data());
            console.log(posts); 

            await addDoc(postsCollectionRef, {
              timestamp: serverTimestamp(),
              caption: caption,
              imageUrl: downloadURL,
              username: username
            });

            setProgress(0);
            setCaption("");
            setImage(null);
          } catch (error) {
            console.error("Error saving data to Firestore:", error);
          }
        }
      );
    } else {
      console.error("No image selected for upload.");
    }
  };

  return (
    <div className="createpost">
      <input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
      {progress > 0 && <progress className="createpost__progress" value={progress} max="100" />}
    </div>
  );
};
