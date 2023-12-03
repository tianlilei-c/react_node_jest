import React from 'react';
import styles from '../main.module.css';

const Followeder = ({ user,onUnfollow }) => {
    const handleUnfollowClick = () => {
        onUnfollow(user.username);
    };
    return (
        <div className={styles.request}>
            <div className={styles.info}>
                <div className={styles["profile-followphoto"]}>
                    <img className={styles["profile-followphoto-img"]}  src={user.avatar} alt="Profile Photo" />
                </div>
                <div className={styles["profile-followphoto-msg"]}>
                    <h5>{user.name}</h5>
                    <p className={styles["text-muted"]}>
                        {user.headline}
                    </p>
                </div>
            </div>
            <div className={styles.action}>
                <button className={styles.btn} onClick={handleUnfollowClick}>unfollow</button>
            </div>
        </div>
    );
};

export default Followeder;
