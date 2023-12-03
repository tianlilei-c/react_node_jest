import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from "./main.module.css"
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Followeder from './compoment/Followed';
import Trends from './compoment/Trends';
import Updatestate from './compoment/Updatestate';
import Updatetrend from './compoment/Updatetrend'
import Addfollow from './compoment/Addfollow'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchbar from './compoment/SearchBar'
import { useHistory } from 'react-router-dom';
import { getUserProfile, updateHeadLine, createArticle, addFollower, getFollowers, getArticleList, removeFollower, logoutApi } from '../../api'
const Indexpage = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [FollowedList, setFollowedList] = useState([]);
    const [FollowedTrendsList, setFollowedTrendsList] = useState([]);
    const [nochangeTrendsList, setnochangeTrendsList] = useState([]);

    const tokenState = useSelector(state => state.tokenState);
    useEffect(() => {
        if (tokenState === false) {
            console.log('主页验证', tokenState);
            history.push('/auth', { message: 'Token expired' });
        }
    }, [tokenState, history]);

    const [userProfile, setuserProfile] = useState({
        avatar: "",
        dob: "",
        email: "",
        headline: "",
        name: "",
        phone: "",
        user: "",
        username: "",
        zipcode: null,
        _id: ""
    });

    useEffect(() => {
        getUserProfile().then((res) => {
            setuserProfile(res)
            getFollowList()
        }).catch((err) => {
            console.log(err);
            toast.error('获取信息失败,请点击退出登录' + err, { autoClose: 1000 });
        })
    }, [])

    const getFollowList = (() => {
        getFollowers().then(res => {
            if (res) {
                setFollowedList(res)
            }
            fetchArticleList()
        }).catch(err => {
            console.error(err);
        })
    })
    const [page, setPage] = useState(1);
    const fetchArticleList = (page) => {
        console.log(page);
        getArticleList(page).then(res => {
            setFollowedTrendsList(prevFollowedTrendsList => [...prevFollowedTrendsList, ...res.articles]);
            setnochangeTrendsList(prevNochangeTrendsList => [...prevNochangeTrendsList, ...res.articles]);
        }).catch(err => {
        })
    }

    const prevScrollY = useRef(0);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleScroll = () => {
        const currentScrollY = window.pageYOffset;
        if (currentScrollY - prevScrollY.current >= 800) {
            setPage(page => page + 1)
            console.log('触发');
            fetchArticleList(page);
            prevScrollY.current = currentScrollY;
        }
    };

    const handleUnfollow = (username) => {
        removeFollower(username).then(res => {
            toast.success('unfollow success', { autoClose: 1000 })
            getFollowList()
        }).catch(err => {
            console.log(err);
        })
    };

    const handleUpstate = (stateobj) => {
        try {
            let obj = {
                headline: stateobj.text,
                username: localStorage.getItem('UserName')
            }
            updateHeadLine(obj).then(res => {
                toast.success('update State Success', { autoClose: 1500 })
                getUserProfile().then((res) => {
                    setuserProfile(res)
                }).catch((err) => {
                    console.log(err);
                    toast.error('获取信息失败,请点击退出登录' + err, { autoClose: 1000 });
                })
            }).catch(err => {
                console.error('用户状态更新失败', err);
            })
        } catch (error) {
        }
    };

    const handleUpTrend = (stateobj) => {
        try {
            let obj = {
                title: stateobj.title,
                body: stateobj.body,
                image: stateobj.image
            }
            createArticle(obj).then((res) => {
                toast.success('up trend success', { autoClose: 1000 })
                fetchArticleList()
            }).catch(err => {
                toast.error('update error', err)
            })
        } catch (error) {
        }
    };

    const handleAddfollow = (addmsg) => {
        addFollower(addmsg.name).then((res) => {
            toast.success('sucess follow', { autoClose: 1000 })
            getFollowList()
        }).catch(err => {
            toast.error(err.message, { autoClose: 1000 })
        })
    }

    const handleSearch = (Searchtext) => {
        const filteredData = nochangeTrendsList.filter((obj) => {
            const { title, body } = obj;
            return title.includes(Searchtext.msg) || body.includes(Searchtext.msg);
        });
        setFollowedTrendsList(filteredData)
        if (Searchtext.msg === "") {
            fetchArticleList()
        }
    }

    const logout = () => {
        logoutApi().then(res => {
            console.log('res');
            history.push('/auth')
        }).catch(err => {
            console.log('logouterr', err);
        })
    }




    return (
        <>
            <ToastContainer />
            <nav>
                <div className={styles.container}>
                    <h2 className={styles.log}>
                    </h2>
                    <div className={styles.create}>
                        <p>State:{userProfile.headline}</p>
                        <p>{userProfile.username}</p>
                        <div className={styles.profilePhoto}>
                            <img src={userProfile.avatar} alt="My Image" />
                        </div>
                        <Link to="/profile" className={`${styles.btn} ${styles['btn-primaryup']}`} htmlFor="create-post">Profile</Link>
                        <button className={`${styles['btn-primaryout']}`} onClick={logout} htmlFor="create-post">logout</button>
                    </div>
                </div>
            </nav>
            <main>
                <div className={styles.container}>
                    <div className={styles.right}>
                        <div className={styles["friend-requests"]} data-testid="followed-list">
                            <h4>Followed</h4>
                            {FollowedList.map((user, index) => (
                                <Followeder key={index} user={user} onUnfollow={handleUnfollow} />
                            ))}
                        </div>
                    </div>
                    <div className={styles.middle}>
                        <Searchbar onSearchinput={handleSearch} />
                        {FollowedTrendsList.map((article, index) => (
                            <Trends key={index} article={article} userProfile={userProfile} updateArticle={fetchArticleList} />
                        ))}
                    </div>
                    <div className={styles.left}>
                        <Updatestate handleupstate={handleUpstate} useravatar={userProfile} />
                        <Updatetrend handleuptrend={handleUpTrend} useravatar={userProfile} />
                        <Addfollow handleaddfollow={handleAddfollow} />
                    </div>
                </div>
            </main>
        </>
    )
}
export default Indexpage;