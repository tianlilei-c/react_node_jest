import React, { useState, useEffect, useMemo } from 'react';
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

const Indexpage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [SearchEmpty, setchageSearchEmpty] = useState(false);
    const [resgisteraddfollowed, setresgisteraddfollowed] = useState(false);
    const [FollowedList, setFollowedList] = useState([]);
    const [FollowedTrendsList, setFollowedTrendsList] = useState([]);

    const userdata = useSelector(state => state.userdata);
    const cacheduserData = useMemo(() => userdata, [userdata]);
    const updateuserData = (newData) => {
        dispatch({ type: 'UPDATE_USERDATA', payload: newData });
    };

    const jsondata = useSelector(state => state.jsondata);
    const cachedjsonData = useMemo(() => jsondata, [jsondata]);
    const updatejsonData = (newData) => {
        dispatch({ type: 'UPDATE_JSONDATA', payload: newData });
    };
    const logindata = useSelector(state => state.logindata);
    const cachedlogindata = useMemo(() => logindata, [logindata]);
    const updatelogindata = (newData) => {
        dispatch({ type: 'LOGIN_DATA', payload: newData });
        let userobj = JSON.stringify(newData)
        localStorage.setItem('user', userobj)
    };

    useEffect(() => {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        if (user || cachedlogindata) {
            updatelogindata(user)
            fetch('https://jsonplaceholder.typicode.com/posts')
                .then(response => response.json())
                .then(data => {
                    updatejsonData(data);
                })
            fetch('https://jsonplaceholder.typicode.com/users')
                .then(response => response.json())
                .then(data => {
                    updateuserData(data);
                })
        } else {
            history.push("/auth");
        }
    }, [])

    useEffect(() => {
        try {
            if (cacheduserData && cachedlogindata.id != null) {
                const matchedUsers = cacheduserData.filter(user => {
                    return (
                        user.id === (cachedlogindata.id + 1) % 10 ||
                        user.id === (cachedlogindata.id + 2) % 10 ||
                        user.id === (cachedlogindata.id + 3) % 10 ||
                        (cachedlogindata.id === 9 && user.id === 10) ||
                        (cachedlogindata.id === 7 && user.id === 10) ||
                        (cachedlogindata.id === 8 && user.id === 10)
                    );
                });
                setFollowedList(matchedUsers);
                updateTrends()
            }
        } catch (error) {
        }
    }, [cachedlogindata, userdata, cacheduserData]);

    useEffect(() => {
        updateTrends()
    }, [SearchEmpty, FollowedList, cachedjsonData]);

    const updateTrends = () => {
        if (FollowedList && cachedjsonData) {
            try {
                let matchedUsers = []
                const trendsuserarr = [cachedlogindata.id];
                const updatedTrendsUserArr = [
                    ...trendsuserarr,
                    ...FollowedList.map(item => item.id)
                ];
                cachedjsonData.forEach(postobj => {
                    if (updatedTrendsUserArr.includes(postobj.userId)) {
                        matchedUsers.push(postobj);
                    }
                });
                matchedUsers.reverse();
                setFollowedTrendsList(matchedUsers);
            } catch (error) {
            }
        }
    }

    const handleUnfollow = (userId) => {
        const updatedFollowedList = FollowedList.filter(user => user.id !== userId);
        setFollowedList(updatedFollowedList);
    };

    const handleUpstate = (stateobj) => {
        try {
            let obj = JSON.parse(JSON.stringify(cachedlogindata));
            obj.company.catchPhrase = stateobj.text;
            updatelogindata(obj);
        } catch (error) {
        }
    };


    const handleUpTrend = (stateobj) => {
        try {
            setFollowedTrendsList(prevList => [stateobj, ...prevList]);
            const newjsonarr = prevData => [stateobj, ...prevData]
            updatejsonData(newjsonarr());
        } catch (error) {
        }
    };


    const handleAddfollow = (addmsg) => {
        const filteredData = cacheduserData.filter((obj) => obj.username === addmsg.name);
        if (filteredData.length > 0) {
            setFollowedList(filteredData.concat(FollowedList));
            setresgisteraddfollowed(true)
            toast.success("ADD FOLLOW SUCCESS!");
        } else {
            toast.error("Not This User")
        }
    }



    const handleSearch = (Searchtext) => {
        const filteredData = FollowedTrendsList.filter((obj) => {
            const { title, body } = obj;
            return title.includes(Searchtext.msg) || body.includes(Searchtext.msg);
        });
        setFollowedTrendsList(filteredData)
        if (Searchtext.msg === "") {
            setchageSearchEmpty(!SearchEmpty)
        }
    }

    return (
        <>
            <ToastContainer />
            <nav>
                <div className={styles.container}>
                    <h2 className={styles.log}>
                    </h2>
                    <div className={styles.create}>
                        <p>State:{cachedlogindata && cachedlogindata.company && cachedlogindata.company.catchPhrase}</p>
                        <p>{cachedlogindata && cachedlogindata.username && cachedlogindata.username}</p>
                        <div className={styles.profilePhoto}>
                            <img src="/image/tx1.jpg" alt="My Image" />
                        </div>
                        <Link to="/profile" className={`${styles.btn} ${styles['btn-primaryup']}`} htmlFor="create-post">Profile</Link>
                        <Link to="/auth" className={`${styles['btn-primaryout']}`} htmlFor="create-post">logout</Link>
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
                        {FollowedTrendsList.map((user, index) => (
                            <Trends key={index} user={user} onUnfollow={handleUnfollow} />
                        ))}
                    </div>
                    <div className={styles.left}>
                        <Updatestate handleupstate={handleUpstate} />
                        <Updatetrend handleuptrend={handleUpTrend} />
                        <Addfollow handleaddfollow={handleAddfollow} />
                    </div>
                </div>
            </main>
        </>
    )
}
export default Indexpage;