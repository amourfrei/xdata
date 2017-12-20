/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-12-20T10:35:33+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2017-12-20T10:35:35+08:00
 */
 import React from 'react';
 import { Tooltip } from 'antd';

 import styles from './index.less';

 const MiniProgress = ({ target, color = 'rgb(19, 194, 194)', strokeWidth, percent }) => (
   <div className={styles.miniProgress}>
     <Tooltip title={`目标值: ${target}%`}>
       <div
         className={styles.target}
         style={{ left: (target ? `${target}%` : null) }}
       >
         <span style={{ backgroundColor: (color || null) }} />
         <span style={{ backgroundColor: (color || null) }} />
       </div>
     </Tooltip>
     <div className={styles.progressWrap}>
       <div
         className={styles.progress}
         style={{
           backgroundColor: (color || null),
           width: (percent ? `${percent}%` : null),
           height: (strokeWidth || null),
         }}
       />
     </div>
   </div>
 );

 export default MiniProgress;
