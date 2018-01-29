/**
 * @Author: Chen Ming <amour>
 * @Date:   2018-01-24T19:34:21+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-01-25T17:46:02+08:00
 */
import React, { Component } from 'react';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { DataView } from '@antv/data-set'

export default class Spline extends Component{
  render(){
    // const { data } = this.props.data || [];
    const data = [
        { month: 'Jan', Tokyo: 7.0, London: 3.9 },
        { month: 'Feb', Tokyo: 6.9, London: 4.2 },
        { month: 'Mar', Tokyo: 9.5, London: 5.7 },
        { month: 'Apr', Tokyo: 14.5, London: 8.5 },
        { month: 'May', Tokyo: 18.4, London: 11.9 },
        { month: 'Jun', Tokyo: 21.5, London: 15.2 },
        { month: 'Jul', Tokyo: 25.2, London: 17.0 },
        { month: 'Aug', Tokyo: 26.5, London: 16.6 },
        { month: 'Sep', Tokyo: 23.3, London: 14.2 },
        { month: 'Oct', Tokyo: 18.3, London: 10.3 },
        { month: 'Nov', Tokyo: 13.9, London: 6.6 },
        { month: 'Dec', Tokyo: 9.6, London: 4.8 }
      ];
    const dv = new DataView();
    dv.source(data).transform({
      type: 'fold',
      fields: ['Tokyo', 'London'],
      key: 'city',
      value: 'temperature',
    });
    const cols = {
      month: {
        range: [0, 1]
      }
    }

    return (
        <Chart height={500} data={dv} scale={cols} forceFit>
          <Axis name="month" />
          <Axis name="temperature" label={{formatter: val => `${val}°C`}}/>
          <Tooltip crosshairs={{type : "y"}}/>
          <Geom type="line" position="month*temperature" size={2} color={'city'} shape="smooth"/>
          <Geom type='point' position="month*temperature" size={4} shape={'circle'} color={'city'} style={{ stroke: '#fff', lineWidth: 1}} />
          <Legend/>
        </Chart>
    );

  }
}
