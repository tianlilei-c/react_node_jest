
import React, { useState, useEffect, useMemo } from 'react';
import stylel from './profile.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from 'react-router-dom';
import { getUserProfile, updateUserProfile, BreakGithubApi, updateavatar } from '../../api'
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'

const Profile = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isFormSwitched, setIsFormSwitched] = useState(false);

    const tokenState = useSelector(state => state.tokenState);
    useEffect(() => {
        if (tokenState === false) {
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
        _id: "",
        userGithubID: null
    });

    const getProfileApi = () => {
        getUserProfile().then(async (res) => {
            setuserProfile(res)
            setFormData({
                pwd: "",
                pwdcon: "",
                email: "",
                zipcode: '',
                phone: "",
                username: res.username
            })
        }).catch((err) => {
            toast.error('Failed to obtain information, please click to log out' + err, { autoClose: 1000 });
        })
    }

    useEffect(() => {
        getProfileApi()
    }, [])

    const [formData, setFormData] = useState({
        pwd: "",
        pwdcon: "",
        email: "",
        zipcode: '',
        phone: "",
    });
    const btnsubmit = async (e) => {
        e.preventDefault();
        if (formData.pwd === formData.pwdcon) {
            await updateUserProfile(formData).then((res) => {
                toast.success('Success Update', { autoClose: 1000 })
                setuserProfile(res.userProfile)
                if (formData.pwdcon !== '') {
                    toast.success('Password Success Update,need login agin', { autoClose: 1000 })
                    setTimeout(() => {
                        history.push("/auth");
                    }, 2000);
                }
            }).catch(err => {
                // toast.error('error update', err);
            })
        } else {
            toast.error("The password confirmation must be the same as the password")
            return false;
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const cleanformdata = () => {
        setFormData({
            pwd: "",
            pwdcon: "",
            email: "",
            zipcode: '',
            phone: "",
            username: formData.username
        });
    };

    const tohome = () => {
        history.push("/");
    }


    const togithub = () => {
        const clientID = '014fb2844b633edb88c7';
        const redirectURI = 'http://localhost:3000/gitcontrol';
        const state = encodeURIComponent(userProfile.username); 
        const authURL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&state=${state}`;
        window.location.href = authURL;
    }

    const breakGithub = async () => {
        let obj = {
            username: userProfile.username
        }
        await BreakGithubApi(obj).then((res) => {
            toast.success('break success', { autoClose: 1000 })
            getProfileApi()
        }).catch(err => {
            console.error('err', err);
        })
    }

    const successCallBack = async (e) => {
        updateavatar({ avatar: e.info.url }).then(res => {
            setuserProfile(res.userProfile)
            toast.success('update success', { autoClose: 1000 })
        }).catch(err => {
            console.error('update avatar error', err);
        })
    }


    const failureCallBack = async (e) => {
        console.error('file to cloudinary error', e);
    }


    return (
        <div className={stylel.body}>
            <ToastContainer />
            <WidgetLoader />
            <div className={stylel.shelllogo}>
                <button onClick={tohome} className={`${stylel.form_button} ${stylel.homebutton} ${stylel.submit} `}  >
                    Back To MAIN
                </button>
                <Widget
                    sources={['local', 'camera', 'dropbox']}
                    resourceType={'image'}
                    cloudName={'dlym7dlsp'}
                    uploadPreset={'hw7web'}
                    buttonText={'update avatar'}
                    folder={'hw7'}
                    cropping={false}
                    multiple={false}
                    autoClose={true}
                    onSuccess={successCallBack}
                    onFailure={failureCallBack}
                    logging={false}
                    customPublicId={'sample'}
                    eager={'w_400,h_300,c_pad|w_260,h_200,c_crop'}
                    use_filename={false}
                    destroy={false}
                    widgetStyles={{
                        palette: {
                            window: '#737373',
                            windowBorder: '#FFFFFF',
                            tabIcon: '#FF9600',
                            menuIcons: '#D7D7D8',
                            textDark: '#DEDEDE',
                            textLight: '#FFFFFF',
                            link: '#0078FF',
                            action: '#FF620C',
                            inactiveTabIcon: '#B3B3B3',
                            error: '#F44235',
                            inProgress: '#0078FF',
                            complete: '#20B832',
                            sourceBg: '#909090'
                        },
                        fonts: {
                            default: null,
                        }
                    }}
                    style={{
                        color: 'white',
                        border: 'none',
                        width: '160px',
                        backgroundColor: 'green',
                        borderRadius: '4px',
                        height: '25px',
                        marginTop: '8px'
                    }}
                />
            </div>
            <div className={stylel.shell}>
                {/* register form */}
                <div className={`${stylel.containercanno}`} id="a-container">
                    <form
                        action=""
                        method=""
                        className={stylel.oldform}
                        id="a-form"
                    >
                    </form>
                </div>
                {/* old msg */}
                <div className={`${stylel.containercanno}`} id="a-container">
                    <form
                        action=""
                        method=""
                        className={stylel.oldform}
                        id="a-form"
                    >
                        <h4 className={`${stylel.form_title} ${stylel.titlecanno}`}>Curr Info</h4>
                        <input
                            id="accountname"
                            name="accountname"
                            placeholder={userProfile?.username || 'user did not login'}
                            className={stylel.form_inputcanno}

                            onChange={handleInputChange}
                        />
                        <input
                            id="email"
                            name="email"
                            className={stylel.form_inputcanno}
                            placeholder={userProfile?.email || 'user did not login'}
                            pattern="\w+@\w+(.\w+){1,4}"

                            onChange={handleInputChange}
                        />
                        <input
                            id="tel"
                            name="tel"
                            type="tel"
                            className={stylel.form_inputcanno}
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            placeholder={userProfile?.phone || 'user did not login'}

                            onChange={handleInputChange}
                        />
                        <input
                            id="zip"
                            name="zip"
                            className={stylel.form_inputcanno}
                            pattern="[0-9]{5}"
                            placeholder={userProfile?.zipcode || userProfile?.address?.zipcode || ''}

                            onChange={handleInputChange}
                        />
                        <div className={stylel.oldmsgpicturebox}>
                            <img src={userProfile.avatar} alt='user avatar'></img>
                        </div>
                        {userProfile.userGithubID ? (
                            <div className={stylel.githubidture_box}>
                                <label className={stylel.github_Label}>GitHub ID：</label>
                                <input
                                    id="userGithubID"
                                    name="userGithubID"
                                    className={stylel.github_inputcanno}
                                    placeholder={userProfile.userGithubID}
                                    onChange={handleInputChange}
                                />
                                <button
                                    className={`${stylel.form_button} ${stylel.githubbutton} ${stylel.submit}`}
                                    onClick={breakGithub}
                                    type="button"
                                >
                                    break GitHub
                                </button>
                            </div>
                        ) : (
                            <button
                                className={`${stylel.form_button} ${stylel.githubbutton_connect} ${stylel.submit}`}
                                onClick={togithub}
                                type="button"
                            >
                                connect to GitHub
                            </button>
                        )}
                        <button className={`${stylel.form_button} ${stylel.Cleanbutton} ${stylel.submitcannotuse} ${stylel.submit}`} type='reset' onClick={cleanformdata}>Clean</button>
                    </form>
                </div>
                <div className={`${stylel.container} ${stylel['a-container']} ${isFormSwitched ? stylel['is-txl'] : ''}`} id="a-container">
                    <form
                        action=""
                        method=""
                        className={stylel.form}
                        id="a-form"
                        onSubmit={btnsubmit}
                    >
                        <h2 className={`${stylel.form_title} ${stylel.title}`}>New Info</h2>
                        <input
                            id="email"
                            name="email"
                            className={stylel.form_input}
                            placeholder="Your e-mail address"
                            pattern="\w+@\w+(.\w+){1,4}"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <input
                            id="phone"
                            name="phone"
                            type="phone"
                            className={stylel.form_input}
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            placeholder="Phone:123-123-1234"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        <input
                            id="zipcode"
                            name="zipcode"
                            className={stylel.form_input}
                            pattern="[0-9]{5}"
                            placeholder="Valid five-digit zip code"
                            value={formData.zipcode}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            id="pwd"
                            name="pwd"
                            className={stylel.form_input}
                            placeholder="Password"

                            value={formData.pwd}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            id="pwdcon"
                            name="pwdcon"
                            className={stylel.form_input}
                            placeholder="Password confirmation"

                            value={formData.pwdcon}
                            onChange={handleInputChange}
                        />
                        <button className={`${stylel.form_button} ${stylel.button} ${stylel.submit}`} type="submit">
                            Update
                        </button>
                        <button className={`${stylel.form_button} ${stylel.Cleanbutton} ${stylel.submit}`} type='reset' onClick={cleanformdata}>Clean</button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default Profile;
