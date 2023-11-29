
import React, { useState, useEffect, useMemo } from 'react';
import stylel from './profile.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../../api'

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
        _id: ""
    });

    useEffect(() => {
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
                toast.success('Success Update',{autoClose:1000})
                setuserProfile(res.userProfile)
                if (formData.pwdcon !== '') {
                    toast.success('Password Success Update,need login agin',{autoClose:1000})
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

    const handleImageUpload = (event) => {
    };

    return (
        <div className={stylel.body}>
            <ToastContainer />
            <div className={stylel.shelllogo}>
                <button onClick={tohome} className={`${stylel.form_button} ${stylel.homebutton} ${stylel.submit} `}  >
                    Back To MAIN
                </button>

                <label htmlFor="file" className={stylel.inputimglabel} >Update Profile Picture</label>
                <input type="file" name='file' id='file' accept="image/*" onChange={handleImageUpload} className={stylel.inputimg} ></input>
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
                            <img src='/image/tx1.jpg'></img>
                        </div>
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
