/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-12-19T17:49:08+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-01-23T16:49:41+08:00
 */



import { fakeBaseData } from '../services/api';

export default {
  namespace: 'base',
  state: {
    baseData:[]
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fakeBaseData);
      yield put({
        type: 'save',
        payload: {
          baseData: response,
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
        baseData:[]
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
