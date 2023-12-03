import React, { useState, useEffect, useMemo } from 'react';
import stylel from './auth.module.css';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory, useLocation } from 'react-router-dom';
import { LoginApi } from '../../api';
import { SIGNUP } from '../../api';
const Login = () => {
    let dispatch = useDispatch()
    const history = useHistory();
    const location = useLocation()
    const [isFormSwitched, setIsFormSwitched] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        headline: '',
        zipcode: '',
        phone: '',
        dob: '',
        avatar: '',
        pwd: ''
    });
    const [loginformData, setloginFormData] = useState({
        loginaccountname: "",
        loginpwd: "",
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const username = params.get('username');
        const msg = params.get('msg');
        if (token && username) {
            toast.success('Login Success!', { autoClose: 1000 })
            localStorage.setItem('sessionId', token)
            localStorage.setItem('UserName', username)
            setTimeout(() => {
                history.push('/')
            }, 1000);
        } else if (msg != undefined && msg) {
            toast.error(msg, { autoClose: 1000 })
        } else {
            dispatch({ type: 'TOKEN_STATE', payload: true });
            if (location.state && location.state.message) {
                toast.error(location.state.message, { autoClose: 1500 });
            }
        }
    }, [])

    const handleloginInputChange = (e) => {
        setloginFormData({
            ...loginformData,
            [e.target.name]: e.target.value
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const bdaycheck = () => {
        if (formData.dob !== "") {
            var bdayinput = formData.dob.toString();
            var datenow = new Date();
            var age = datenow.getFullYear() - bdayinput.substr(0, 4);
            var month = datenow.getMonth() - bdayinput.substr(4, 2);
            var date = datenow.getDate() - bdayinput.substr(6, 2);
            if (month < 0 || (month === 0 && date < 0)) {
                age--;
            }
            if (age < 18) {
                toast.error("Only individuals 18 years of age or older on the day of registration are allowed to register")
                return false;
            } else if (age >= 18) {
                return true;
            }
        }
    };

    const pwdcheck = () => {
        if (formData.pwd === formData.password) {
            return true;
        } else {
            toast.error("The password confirmation must be the same as the password")
            return false;
        }
    };

    const namecheck = () => {
        var namepattern = /^[a-zA-Z][a-zA-Z0-9]+$/;
        if (namepattern.test(formData.username)) {
            return true;
        } else {
            toast.error("Account name must start with letters and be combined of letters or letters and numbers")
            return false;
        }
    };

    function convertToDate(input) {
        if (typeof input === "string" && input.length === 8) {
            const year = input.substr(0, 4);
            const month = input.substr(4, 2);
            const day = input.substr(6, 2);
            return `${year}-${month}-${day}`;
        } else {
            return "error input";
        }
    }

    const SIGNUP_btnsubmit = async (e) => {
        e.preventDefault();
        let state = namecheck() && bdaycheck() && pwdcheck()
        if (state) {
            formData.dob = convertToDate(formData.dob)
            await SIGNUP(formData).then(async (res) => {
                toast.success('SignUp Success!', { autoClose: 1000 })
                setloginFormData({
                    loginaccountname: formData.username,
                    loginpwd: formData.password,
                })
                await loginbtnsubmit()
            }).catch((error) => {
                if (error.status === 484) {
                    toast.error(error.message, { autoClose: 1500 })
                } else {
                    console.error(error.message);
                }
            });

        }
        return state
    };

    const cleanformdata = () => {
        setFormData({
            username: null,
            email: null,
            password: null,
            name: null,
            headline: null,
            zipcode: null,
            phone: null,
            dob: null,
            avatar: null,
            pwd: null
        });
    };

    const loginbtnsubmit = async (e) => {
        e.preventDefault();
        console.log('触发删除信息');
        localStorage.removeItem('sessionId')
        localStorage.removeItem('UserName')
        let obj = {
            username: loginformData.loginaccountname,
            password: loginformData.loginpwd
        }
        await LoginApi(obj).then((res) => {
            toast.success('Login Success!', { autoClose: 1000 })
            localStorage.setItem('sessionId', res.sessionKey)
            localStorage.setItem('UserName', obj.username)
            setTimeout(() => {
                console.log('跳转前触发', localStorage.getItem('sessionId'));
                history.push('/')
            }, 1000);
        }).catch((err) => {
            if (err.status === 400) {
                toast.error('Incorrect username or password', { autoClose: 1000 })
            } else {
                toast.error('Login Error' + { autoClose: 1000 })
            }
        })
    };

    const handleFormSwitch = () => {
        setIsFormSwitched(!isFormSwitched);
    };

    const loginbygithub = () => {
        const clientID = '014fb2844b633edb88c7';
        const redirectURI = 'http://localhost:3000/gitcontrol';
        const authURL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
        window.location.href = authURL;
    }


    return (
        <div className={stylel.body}>
            <div className={stylel.shell}>
                <ToastContainer />
                {/* register form */}
                <div className={`${stylel.container} ${stylel['a-container']} ${isFormSwitched ? stylel['is-txl'] : ''}`} id="a-container">
                    <form
                        action=""
                        method=""
                        className={stylel.form}
                        id="a-form"
                        onSubmit={SIGNUP_btnsubmit}
                    >
                        <h2 className={`${stylel.form_title} ${stylel.title}`}>Register</h2>
                        <input
                            id="username"
                            name="username"
                            placeholder="register:Your account name"
                            className={stylel.form_input}
                            required
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                        <input
                            id="name"
                            className={stylel.form_input}
                            name="name"
                            placeholder="Your display name(optional)"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <input
                            id="email"
                            name="email"
                            className={stylel.form_input}
                            placeholder="Your e-mail address"
                            pattern="\w+@\w+(.\w+){1,4}"
                            required
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
                            required
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        <input
                            id="dob"
                            name="dob"
                            className={stylel.form_input}
                            pattern="(202[0-2]|20[0-1][0-9]|19[0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])"
                            placeholder="Birthday:19991231"
                            required
                            value={formData.dob}
                            onChange={handleInputChange}
                        />
                        <input
                            id="zipcode"
                            name="zipcode"
                            className={stylel.form_input}
                            pattern="[0-9]{5}"
                            placeholder="Valid five-digit zip code"
                            required
                            value={formData.zipcode}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            id="pwd"
                            name="pwd"
                            className={stylel.form_input}
                            placeholder="enter your Password"
                            required
                            value={formData.pwd}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            id="pwdcon"
                            name="password"
                            className={stylel.form_input}
                            placeholder="Password confirmation"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <button className={`${stylel.form_button} ${stylel.button} ${stylel.submit}`} type="submit">
                            SIGN UP
                        </button>

                        <button className={`${stylel.form_button} ${stylel.Cleanbutton} ${stylel.submit}`} type='reset' onClick={cleanformdata}>Clear</button>
                    </form>
                </div>

                {/* login form */}
                <div className={`${stylel.container} ${stylel['b-container']} ${isFormSwitched ? `${stylel['is-txl']} ${stylel['is-z']}` : ''}`} id="b-container">
                    <form action="" method="" className={stylel.form} id="b-form" onSubmit={loginbtnsubmit}>
                        <h2 className={`${stylel.form_title} ${stylel.title}`}>Login</h2>
                        <span className={stylel.form_span}>Please enter your Email and Password</span>
                        <input
                            name="loginaccountname"
                            placeholder="Your account name"
                            className={stylel.form_input}
                            required
                            value={loginformData.loginaccountname}
                            onChange={handleloginInputChange}
                        />
                        <input
                            type="password"
                            name="loginpwd"
                            className={stylel.form_input}
                            placeholder="Password"
                            required
                            value={loginformData.loginpwd}
                            onChange={handleloginInputChange}
                        />
                        <a className={stylel.form_link}>If you forget password please click here.</a>
                        <button className={`${stylel.form_button} ${stylel.button} ${stylel.submit}`} type="submit">SIGN IN!</button>
                        <button className={`${stylel.form_button} ${stylel.button} ${stylel.submit}`} type="button" onClick={loginbygithub}>login BY GITHUB</button>

                    </form>
                </div>

                {/* change form */}
                <div className={`${stylel.switch} ${isFormSwitched ? stylel['is-txr'] : ''}`} id="switch-cnt">
                    <div className={stylel.switch_circle}></div>
                    <div className={`${stylel.switch_circle} ${stylel['switch_circle-t']}`}></div>
                    <div className={`${stylel.switch_container} ${isFormSwitched ? stylel['is-hidden'] : ''}`} id="switch-c1">
                        <h2 className={`${stylel.switch_title} ${stylel.title}`} stylel={{ letterSpacing: '0' }}> Hello Friend!</h2>
                        <p className={`${stylel.switch_description} ${stylel.description}`}>Go register an account and become an esteemed fan member, let us embark on a marvelous journey!</p>
                        <button className={`${stylel.switch_button} ${stylel.button} ${stylel['switch-btn']}`} onClick={handleFormSwitch}>SIGN IN</button>
                    </div>

                    <div className={`${stylel.switch_container} ${isFormSwitched ? '' : stylel['is-hidden']}`} id="switch-c2">
                        <h2 className={`${stylel.switch_title} ${stylel.title}`} stylel={{ letterSpacing: '0' }}>Welcome Back!</h2>
                        <p className={`${stylel.switch_description} ${stylel.description}`}>Do you already have an account? Go log in to your account and enter the wonderful world!</p>
                        <button className={`${stylel.switch_button} ${stylel.button} ${stylel['switch-btn']}`} onClick={handleFormSwitch}>To SIGN UP</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Login;
