import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";

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
  const [visible, setVisible] = useState(10);

  const getPosts = async () => {
    try {
      setAuthToken(token);
      const allPosts = await API.get("/posts");
      setPosts(allPosts.data.data.posts.sort((a, b) => a - b).reverse());
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

  const showMore = () => {
    setVisible((prevValue) => prevValue + 10);
  };

  return posts == undefined ? (
    <p>Loading...</p>
  ) : (
    <div>
      {posts
        .filter((val) => {
          if (props.search === "") {
            return val;
          } else if (
            val.title.toLowerCase().includes(props.search.toLowerCase())
          ) {
            return val;
          }
        })
        .slice(0, visible)
        .map((post) => (
          <img
            className="img-post-content"
            onClick={() => toDetailPost(post.id)}
            key={post.id}
            src={post.photos[0].photo}
            alt="img-post"
          />
        ))}

      {props.search === "" ? (
        <div className="load-more-btn">
          <Button onClick={() => showMore()} variant="secondary">
            Load More
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Content;
