/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-12-19T17:49:08+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-02-01T16:13:31+08:00
 */



import { getPayTypeData } from '../services/api';

export default {
  namespace: 'pay',
  state: {
    payTypeData:[]
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getPayTypeData);
      yield put({
        type: 'save',
        payload: {
          payTypeData: response,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
        loading: false,
      };
    },
    clear() {
      return {
        payTypeData:[]
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};
