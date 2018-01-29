/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-11-19T22:37:16+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-01-29T10:06:44+08:00
 */



import { stringify } from 'qs';
import request from '../utils/request';

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function fakeChartData(){
  return request('/api/fake_chart_data');
}

export async function fakeBaseData(){
  return {
 		"nowaday": {
 			"tradeAmt": 350,
 			"tradeCnt": 30,
 			"tradeUsers": 10
 		},
 		"contrastive": {
 			"tradeAmt": 280,
 			"tradeCnt": 20,
 			"tradeUsers": 5
 		}
 	}
  // return request('/api/fake_base_data');
}
