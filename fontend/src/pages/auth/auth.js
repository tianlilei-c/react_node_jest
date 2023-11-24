import React, { useState, useEffect, useMemo } from 'react';
import stylel from './auth.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isFormSwitched, setIsFormSwitched] = useState(false);

    const userdata = useSelector(state => state.userdata);
    const cacheduserData = useMemo(() => userdata, [userdata]);
    const updateuserData = (newData) => {
        dispatch({ type: 'UPDATE_USERDATA', payload: newData });
    };

    const updatejsonData = (newData) => {
        dispatch({ type: 'UPDATE_JSONDATA', payload: newData });
    };

    const updatelogindata = (newData) => {
        dispatch({ type: 'LOGIN_DATA', payload: newData });
    };

    const [formData, setFormData] = useState({
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
            catchPhrase: "I'm happy!",
            bs: ""
        }
    });

    const [loginformData, setloginFormData] = useState({
        loginaccountname: "",
        loginpwd: "",
    });

    useEffect(() => {
        updatelogindata(null)
        localStorage.removeItem('user');
    }, [])

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => {
                updatejsonData(data);
            }).catch(error => console.error(error))
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => {
                updateuserData(data);
            }).catch(error => console.error(error))
    }, []);



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
        const hasSameName = cacheduserData.some(obj => obj.username === formData.username);
        if (hasSameName) {
            toast.error('same name with userjson');
            return
        }
        if (formData.bday !== "") {
            var bdayinput = formData.bday.toString();
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
        if (formData.pwd === formData.pwdcon) {
            toast.success("two password is same");
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

    const btnsubmit = (e) => {
        e.preventDefault();
        let state = namecheck() && bdaycheck() && pwdcheck()
        if (state) {
            
            updatelogindata(formData);
            const userString = JSON.stringify(formData);
            localStorage.setItem('user', userString);
            toast.success("success Sign up");
            history.push("/");
        }
        return state
    };

    const handleFormSwitch = () => {
        setIsFormSwitched(!isFormSwitched);
    };

    const loginbtnsubmit = (e) => {
        e.preventDefault();
        const matchedUser = cacheduserData.filter(user => {
            return (
                user.username === loginformData.loginaccountname &&
                user.address.street === loginformData.loginpwd
            );
        });
        if (matchedUser.length === 1) {
            updatelogindata(matchedUser[0]);
            const userString = JSON.stringify(matchedUser[0]);
            localStorage.setItem('user', userString);
            toast.success("login success");
            history.push("/");
        } else {
            toast.error("password Error or Incorrect password ");
        }
    };

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
                        onSubmit={btnsubmit}
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
                            id="bday"
                            name="bday"
                            className={stylel.form_input}
                            pattern="(202[0-2]|20[0-1][0-9]|19[0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])"
                            placeholder="Birthday:19991231"
                            required
                            value={formData.bday}
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
                            name="pwdcon"
                            className={stylel.form_input}
                            placeholder="Password confirmation"
                            required
                            value={formData.pwdcon}
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
                    </form>
                </div>

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
