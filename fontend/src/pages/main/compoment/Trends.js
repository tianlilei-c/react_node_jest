import React, { useEffect, useState } from 'react';
import styles from '../main.module.css';
import { useSelector, useDispatch } from 'react-redux';

const Trends = ({ user }) => {
    const userJson = useSelector(state => state.userdata)
    const [startTime, setStartTime] = useState(null);
    const [poster, setposter] = useState(null)


    useEffect(() => {
        const timestamp = Date.now();
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        setStartTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    }, []);


    useEffect(() => {
        if (userJson) {
            setposter(userJson.find(item => item.id === user.userId));
        }
    }, [user, userJson]);

    return (
        <div className={styles.feeds}>
            {/* <!-- =================FEED 1=================--> */}
            <div className={styles.feed}>
                <div className={styles.head}>
                    <div className={styles.user}>
                        <div className={styles['trendphoto']}>
                            <img src="/image/tx1.jpg" />
                        </div>
                        <div className={styles.info}>
                            <h3>{user.title}</h3>
                            <small>{user.body}</small>
                        </div>
                    </div>
                </div>

                {user.isTextOnly !== true && (
                    <div className={styles.photo}>
                        <img src="/image/1.jpg" alt="Post Photo" />
                    </div>
                )}
                {user.isTextOnly && (
                    <div className={styles.body}>{user.body}</div>
                )}

                <div className={styles['action-buttons']}>
                    <div className={styles['interaction-buttons']}>
                        <button className={styles['image-button']}>
                            <img src='/image/pl.png'></img>
                        </button>
                    </div>
                    <div className={styles['interaction-buttons']}>
                        {user.name ? (
                            <p>{user.name}</p>
                        ) : (
                            poster && poster.username && <p>{poster.username}</p>
                        )}

                        <p>{user.time ? user.time : startTime}</p>
                    </div>
                    <div className={styles.bookmark}>
                        <button className={styles['image-button']}>
                            <img src="/image/bj.png" alt="Button Image" />
                        </button>
                    </div>
                </div>
                <div className={styles['action-comment']}>
                    <div>
                        Mrs. Dennis Schulist: It's so cool!
                    </div>
                    <div>
                        Elwyn.Skiles: I love it!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trends;
