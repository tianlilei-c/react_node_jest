import React, { useState, useEffect, useMemo } from 'react';
import styles from '../main.module.css';

const updatestate = ({ handleupstate}) => {
    const [post, setPost] = useState({
        text: '',
        image: null
    });

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
            image: URL.createObjectURL(file)
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleupstate(post)
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
                    placeholder="What's your State?"
                    name="text"
                    value={post.text}
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
                    type="submit"
                    value="Update State"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                />
            </form>
        </div>
    );
};

export default updatestate;
