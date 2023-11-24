import React, { useState, useEffect } from 'react';
import styles from '../main.module.css';

const updatestate = ({ handleuptrend }) => {
  const [post, setPost] = useState({
    title: '',
    image: null,
    body: '',
    time: null,
    isTextOnly: true,
    name: null
  });
  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    if (user && user.name) {
      setPost(prevPost => ({
        ...prevPost,
        name: user.name,
        userId: user.id ? user.id : null
      }));
    }
  }, []);

  useEffect(() => {
    if (post.time !== null) {
      handleuptrend(post)
    }
  }, [post.time]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPost(prevPost => ({
      ...prevPost,
      [name]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setPost(prevPost => ({
      ...prevPost,
      image: URL.createObjectURL(file),
      isTextOnly: false 
    }));
  };

  const clearmsg = () => {
    setPost(prevPost => ({
      ...prevPost,
      title: '',
      image: null,
      body: '',
      time: null,
      isTextOnly: true
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const timestamp = Date.now();
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
    if (post.title !== '' && post.body !== '') {
      setPost(prevPost => ({
        ...prevPost,
        time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }));
    }
  };

  return (
    <div className={styles.sidebar}>
      <form onSubmit={handleSubmit} className={styles['create-post']}>
        <div className={styles['profile-photo']}>
          <img src="/image/tx1.jpg" alt="Profile Photo" />
        </div>
        <input
          id="create-post"
          type="text"
          className={styles.createinput}
          placeholder="What's title?"
          name="title"
          value={post.title}
          onChange={handleInputChange}
        />
        <input
          id="create-post"
          type="text"
          className={styles.createinput}
          placeholder="What's body?"
          name="body"
          value={post.body}
          onChange={handleInputChange}
        />
        <label htmlFor="file" className={styles.inputimglabel}>Upload IMG</label>
        <input
          type="file"
          name="file"
          id="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={styles.inputimg}
        />
        <input
          type="button"
          value="Clear"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={clearmsg}
        />
        <input
          type="submit"
          value="Post"
          className={`${styles.btn} ${styles.btnPrimary}`}
          data-testid="post-button"
        />
        <label htmlFor="isTextOnly" className={styles.textOnlyLabel}>
          <input
            type="checkbox"
            id="isTextOnly"
            name="isTextOnly"
            checked={post.isTextOnly}
            onChange={() => setPost(prevPost => ({ ...prevPost, isTextOnly: !prevPost.isTextOnly }))}
          />
          Pure Text Dynamic
        </label>
      </form>
    </div>
  );
};

export default updatestate;
