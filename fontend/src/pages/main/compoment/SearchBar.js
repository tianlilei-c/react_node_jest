import React, { useState, useEffect, useMemo } from 'react';
import styles from '../main.module.css';

const updatestate = ({ onSearchinput }) => {
    const [post, setPost] = useState({
        msg: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
        
    };

    useEffect(()=>{
        onSearchinput(post)
    },[post])
    return (
        <div className={styles['search-bar']}>
            <div className={styles.searchiconbox}><img  src='/image/search.png'></img></div> 
            <input type="search" id='Searchipt' name='msg' value={post.msg} onChange={handleInputChange} placeholder="Search messages" />
        </div>
    );
};

export default updatestate;
