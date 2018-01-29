/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-11-19T22:37:16+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-01-26T17:25:39+08:00
 */



import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '交易趋势',
        icon: 'dashboard',
        path: 'dynamic',
        children: [
          {
            name: '实时数据',
            path: 'realtime',
            component: dynamicWrapper(app, ['chart', 'base', 'rule'], () => import('../routes/Realtime/Realtime'))
          },
          // {
          //   name: '历史趋势',
          //   path: 'history',
          //   component: dynamicWrapper(app, ['chart', 'base', 'rule'], () => import('../routes/History/History')),//配置需要加载的组件内容，包括models
          // },
        ]
      },
    ],
  },
];
