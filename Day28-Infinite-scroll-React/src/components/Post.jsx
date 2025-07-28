import { useEffect } from "react";

const Post = ({ data = [], setPageNo }) => {
  useEffect(() => {
    const lastImage = document.querySelector(".post-image:last-child");
    if (!lastImage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.unobserve(entries[0].target);
          setPageNo((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(lastImage);

    return () => {
      if (lastImage) {
        observer.unobserve(lastImage);
      }
      observer.disconnect();
    };
  }, [data]);

  return (
    <div className="container">
      {data.map((item, index) => (
        <img
          className="post-image"
          key={`${item.id}-${index}`}
          src={item.download_url}
          alt={`Post ${index}`}
        />
      ))}
    </div>
  );
};

export default Post;
