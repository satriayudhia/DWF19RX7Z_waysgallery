import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

//CSS
import "./Content.scss";

//Config
import { API, setAuthToken } from "../../../config/API";

const Content = (props) => {
  const router = useHistory();
  //Get UserInfo
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");
  //State
  const [posts, setPosts] = useState(undefined);

  const getPosts = async () => {
    try {
      setAuthToken(token);
      const allPosts = await API.get("/posts");
      setPosts(allPosts.data.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const toDetailPost = (id) => {
    router.push(`/detail-post/${id}`);
  };

  return posts == undefined ? (
    <p>Loading...</p>
  ) : (
    <div>
      {posts.map((post) => (
        <img
          className="img-post-content"
          onClick={() => toDetailPost(post.id)}
          key={post.id}
          src={post.photos[0].photo}
          alt="img-post"
        />
      ))}
    </div>
  );
};

export default Content;
