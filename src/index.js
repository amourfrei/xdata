/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-11-19T22:37:16+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2017-12-19T21:54:47+08:00
 */



import dva from 'dva';
import 'moment/locale/zh-cn';
import 'ant-design-pro/dist/ant-design-pro.css';
import browserHistory from 'history/createBrowserHistory';
import './polyfill';
import './index.less';

// 1. Initialize
const app = dva({
  history: browserHistory(),
});

// 2. Plugins
// app.use({});

// 3. Register global model
app.model(require('./models/global'));
// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
