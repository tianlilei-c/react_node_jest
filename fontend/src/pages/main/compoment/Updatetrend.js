import React, { useState, useEffect } from 'react';
import styles from '../main.module.css';
import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'
import { toast } from 'react-toastify';

const updatestate = (props) => {
  const [post, setPost] = useState({
    title: '',
    image: null,
    body: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPost(prevPost => ({
      ...prevPost,
      [name]: value
    }));
  };

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];

  // };

  const clearmsg = () => {
    setPost(prevPost => ({
      ...prevPost,
      title: '',
      image: null,
      body: ''
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (post.title !== '' && post.body !== '') {
      props.handleuptrend(post)
    }
  };

  const successCallBack = async (e) => {
    console.log(e);
    setPost(prevPost => ({
      ...prevPost,
      image: e.info.url
    }));
    toast.success('cache image ok', { autoClose: 700 })
    // updateavatar({ avatar: e.info.url }).then(res => {
    //   console.log('res', res);
    //   setuserProfile(res.userProfile)
    //   toast.success('图像更新成功', { autoClose: 1000 })
    // }).catch(err => {
    //   console.error('update avatar error', err);
    // })
  }


  const failureCallBack = async (e) => {
    console.log('file to cloudinary error', e);
  }


  return (
    <div className={styles.sidebar}>
      <WidgetLoader />
      <form onSubmit={handleSubmit} className={styles['create-post']}>
        <div className={styles['profile-label']}>
          {/* <img src={props.useravatar.avatar} alt="Profile Photo" /> */}
          post a new Trends
        </div>
        <input
          id="create-post"
          type="text"
          className={styles.createinput}
          placeholder="What's title?"
          name="title"
          value={post.title}
          onChange={handleInputChange}
        />
        <input
          id="create-post"
          type="text"
          className={styles.createinput}
          placeholder="What's body?"
          name="body"
          value={post.body}
          onChange={handleInputChange}
        />
        <Widget
          sources={['local', 'camera', 'dropbox']}
          resourceType={'image'}
          cloudName={'dlym7dlsp'}
          uploadPreset={'hw7web'}
          buttonText={'up img'}
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
              default: null
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

        <input
          type="button"
          value="Clear"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={clearmsg}
        />
        <input
          type="submit"
          value="Post"
          className={`${styles.btn} ${styles.btnPrimary}`}
          data-testid="post-button"
        />

      </form>
    </div>
  );
};

export default updatestate;
