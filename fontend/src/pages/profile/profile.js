
import React, { useState, useEffect, useMemo } from 'react';
import stylel from './profile.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from 'react-router-dom';

const Profile = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isFormSwitched, setIsFormSwitched] = useState(false);

    const logindata = useSelector(state => state.logindata);
    const cachelogindata = useMemo(() => logindata, [logindata]);
    const updatelogindata = (newData) => {
        dispatch({ type: 'LOGIN_DATA', payload: newData });
    };

    useEffect(() => {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        if (user) {
            updatelogindata(user)
        } else {
            history.push("/auth");
        }
    }, [])

    const [formData, setFormData] = useState({
        pwd: "",
        pwdcon: "",
        email: "",
        zipcode: '',
        phone: "",
    });


    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    const btnsubmit = (e) => {
        e.preventDefault(); 
        if (formData.pwd === formData.pwdcon) {
            try {
                let obj = deepClone(cachelogindata)
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== '' && value !== undefined && value !== null) {
                        if (!obj.hasOwnProperty(key)) {
                            obj[key] = value;
                        } else {
                            obj[key] = value;
                        }
                    }
                });
                updatelogindata(obj);
            } catch (error) {
            }

        } else {
            toast.error("The password confirmation must be the same as the password")
            return false;
        }
    };

    const deepClone = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        var clone = Array.isArray(obj) ? [] : {};

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = deepClone(obj[key]);
            }
        }

        return clone;
    }
    const cleanformdata = () => {
        setFormData({
            bday: "",
            pwd: "",
            pwdcon: "",
            id: null,
            name: "",
            username: "",
            email: "",
            zipcode: '',
            address: {
                street: "",
                suite: "",
                city: "",
                zipcode: "",
            },
            phone: "",
            website: "",
            company: {
                name: "",
                catchPhrase: "",
                bs: ""
            }
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
                            placeholder={cachelogindata?.username || 'user did not login'}
                            className={stylel.form_inputcanno}

                            onChange={handleInputChange}
                        />
                        <input
                            id="email"
                            name="email"
                            className={stylel.form_inputcanno}
                            placeholder={cachelogindata?.email || 'user did not login'}
                            pattern="\w+@\w+(.\w+){1,4}"

                            onChange={handleInputChange}
                        />
                        <input
                            id="tel"
                            name="tel"
                            type="tel"
                            className={stylel.form_inputcanno}
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            placeholder={cachelogindata?.phone || 'user did not login'}

                            onChange={handleInputChange}
                        />
                        <input
                            id="zip"
                            name="zip"
                            className={stylel.form_inputcanno}
                            pattern="[0-9]{5}"
                            placeholder={cachelogindata?.zipcode || cachelogindata?.address?.zipcode || ''}

                            onChange={handleInputChange}
                        />

                        <input
                            id="zip"
                            name="zip"
                            className={stylel.form_inputcanno}
                            pattern="[0-9]{5}"
                            placeholder={cachelogindata?.pwd ? '*'.repeat(cachelogindata.pwd.length) : cachelogindata?.address?.street ? '*'.repeat(cachelogindata.address.street.length) : ''}

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
