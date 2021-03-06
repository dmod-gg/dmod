import React from 'react';
import styles from '../../styles/apply.module.scss';

function Services(props) {
    return (
        <>
            <div onClick={props.setModerator} id="SERVER_MODERATOR" className={styles.large_selector}>
                <div className={styles.image}>
                    <img src={"/verified.png"}></img>
                </div>
                <div className={styles.text}>
                    <h3>Server moderator</h3>
                    <p>Apply to moderate servers!</p>
                </div>
            </div>
            <div onClick={props.setOwner} id="SERVER_OWNER" className={styles.large_selector}>
                <div className={styles.image}>
                    <img src={"/google-forms.png"}></img>
                </div>
                <div className={styles.text}>
                    <h3>Server owner</h3>
                    <p>Post a job listing</p>
                </div>
            </div>
        </>
    )
}

export default Services;