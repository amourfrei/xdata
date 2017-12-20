/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-11-19T22:37:16+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2017-12-20T09:36:07+08:00
 */



import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { imgMap } from './mock/utils';
import { getNotices } from './mock/notices';
import { delay } from 'roadhog-api-doc';
import { getFakeChartData } from './mock/chart';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Deluxe',
      avatar: 'https://img30.360buyimg.com/jr_image/jfs/t12508/281/1803109041/3476/7eb6442e/5a2a67b1Nbd993e39.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/rule': getRule,
  'GET /api/fake_chart_data': getFakeChartData,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'GET /api/notices': getNotices,
};

export default noProxy ? {} : delay(proxy, 1000);
