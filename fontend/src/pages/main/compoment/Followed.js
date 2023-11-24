import React from 'react';
import styles from '../main.module.css';

const Followeder = ({ user,onUnfollow }) => {
    const handleUnfollowClick = () => {
        onUnfollow(user.id);
    };
    return (
        <div className={styles.request}>
            <div className={styles.info}>
                <div className={styles["profile-followphoto"]}>
                    <img className={styles["profile-followphoto-img"]}  src="/image/2.jpg" alt="Profile Photo" />
                </div>
                <div className={styles["profile-followphoto-msg"]}>
                    <h5>{user.name}</h5>
                    <p className={styles["text-muted"]}>
                        {user.company.catchPhrase}
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
