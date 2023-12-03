import React, { Profiler, useEffect, useState } from 'react';
import styles from '../main.module.css';
import { toast } from 'react-toastify';
import { updateArticle, addCommentToArticle } from '../../../api';
import { toFormData } from 'axios';
const Trends = (props) => {
    let article = props.article
    let userProfile = props.userProfile
    const Addcomment = () => {
        const Comment = prompt('please enter your Comment');
        let obj = {
            commenterId: userProfile.user,
            commenterName: userProfile.username,
            comment: Comment
        }
        addCommentToArticle(article._id, obj).then(res => {
            toast.success('comment success', { autoClose: 1000 })
            props.updateArticle()
        }).catch(err => {
            toast.error('comment error', { autoClose: 1000 })
        })
    }

    const editArticle = () => {
        if (article.userId === userProfile.user) {
            const title = prompt('please enter new title');
            const body = prompt('please enter new body');
            let obj = {
                title: title,
                body: body,
                articleId: article._id,
                image: '',
            }
            updateArticle(obj).then(res => {
                toast.success('更新成功', { autoClose: 1000 })
                props.updateArticle()
            }).catch(err => {
                toast.error(err.message, { autoClose: 1000 })
            })
        } else {
            toast.error('your are not wirter', { autoClose: 1000 })
        }
    }

    return (
        <div className={styles.feeds}>
            {/* <!-- =================FEED 1=================--> */}
            <div className={styles.feed}>
                <div className={styles.head}>
                    <div className={styles.article}>
                        <div className={styles['trendphoto']}>
                            <img src={userProfile.avatar} />
                        </div>
                        <div className={styles.info}>
                            <h3>{article.title}</h3>
                            <small>{article.body}</small>
                        </div>
                    </div>
                </div>
                <div className={styles.photo}>
                    {article.image ? <img src={article.image} alt="Post Photo" /> : null}
                </div>


                <div className={styles['action-buttons']}>
                    <div className={styles['interaction-buttons']}>
                        <button className={styles['image-button']} onClick={Addcomment}>
                            <img src='/image/pl.png'></img>
                        </button>
                    </div>
                    <div className={styles['interaction-buttons']}>
                        <p>{article.name}</p>
                        <p>{article.createdAt}</p>
                    </div>
                    <div className={styles.bookmark}>
                        <button className={styles['image-button']} onClick={editArticle}>
                            <img src="/image/bj.png" alt="Button Image" />
                        </button>
                    </div>
                </div>
                <div className={styles['action-comment']}>
                    {article.comments && article.comments.length > 0 && (
                        <div className={styles.comments}>
                            {article.comments.map((comment, index) => (
                                <div key={index} className={styles.comment}>
                                    <p>{comment.commenterName}: {comment.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Trends;
