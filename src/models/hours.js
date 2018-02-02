/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-12-19T17:49:08+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-02-02T15:59:58+08:00
 */



import { getHoursData } from '../services/api';

export default {
  namespace: 'hours',
  state: {
    hoursData:[]
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(getHoursData);
      yield put({
        type: 'save',
        payload: {
          hoursData: response,
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
        hoursData:[]
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
