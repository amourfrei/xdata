/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-12-20T10:09:15+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2017-12-20T10:09:39+08:00
 */
 import React from 'react';
 import { Icon } from 'antd';
 import classNames from 'classnames';
 import styles from './index.less';

 const Trend = ({ colorful = true, flag, children, className, ...rest }) => {
   const classString = classNames(styles.trendItem, {
     [styles.trendItemGrey]: !colorful,
   }, className);
   return (
     <div
       {...rest}
       className={classString}
       title={typeof children === 'string' ? children : ''}
     >
       <span className={styles.value}>{children}</span>
       {flag && <span className={styles[flag]}><Icon type={`caret-${flag}`} /></span>}
     </div>
   );
 };

 export default Trend;
