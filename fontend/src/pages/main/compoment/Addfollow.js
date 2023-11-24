import React, { useState, useEffect, useMemo } from 'react';
import styles from '../main.module.css';

const updatestate = ({ handleaddfollow}) => {
    const [post, setPost] = useState({
        name: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        handleaddfollow(post)
    };
    return (
        <div className={styles.sidebar}>
            <form onSubmit={handleSubmit} className={styles['create-post']}>
                <input
                    id="create-post"
                    type="name"
                    className={styles.createinput}
                    placeholder="Whom would you like to follow?"
                    name="name"
                    value={post.name}
                    onChange={handleInputChange}
                />
                <input
                    type="submit"
                    value="Add followers"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                />
            </form>
        </div>
    );
};

export default updatestate;
