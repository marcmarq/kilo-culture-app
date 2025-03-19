import React from 'react';
import styles from './AdminProfile.module.css';
import profilePicture from '../../assets/lenus-final.png';

const AdminProfile = () => {
  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Profile Image Overlapping Both Panels */}
          <img src={profilePicture} alt="Profile" className={styles.profileImage} />

          <div className={styles.leftPanel}></div>
          <div className={styles.rightPanel}>
            <div className={styles.field}>
              <label>Name:</label>
              <p>yeu</p>
            </div>

            <div className={styles.field}>
              <label>Email:</label>
              <p>yeumarcmarquez@gmail.com</p>
            </div>

            <div className={styles.field}>
              <label>Contact Number:</label>
              <p>0998 382 9942</p>
            </div>

            <div className={styles.field}>
              <label>Address:</label>
              <p>100 Cordillera street, Central Park Subdivision, Brgy. Talomo, Davao City, Philippines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
