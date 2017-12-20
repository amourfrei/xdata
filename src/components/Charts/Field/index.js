/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-12-20T10:26:12+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2017-12-20T10:33:38+08:00
 */
 import React from 'react';

 import styles from './index.less';

 const Field = ({ label, value, ...rest }) => (
   <div className={styles.field} {...rest}>
     <span>{label}</span>
     <span>{value}</span>
   </div>
 );

 export default Field;
