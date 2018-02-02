/**
 * @Author: Chen Ming <amour>
 * @Date:   2018-01-24T19:34:21+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-02-02T13:54:58+08:00
 */
import React, { Component } from 'react';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { DataSet } from '@antv/data-set'

export default class Spline extends Component{
  render(){

    const {
      title,
      height = 500,
      padding = [60, 20, 40, 40],
      // titleMap = ['y1', 'y2'],
      borderWidth = 2,
      data = [
        {
          x: 0,
          y1: 0,
          y2: 0,
        }
      ]
    } = this.props;

    let titleMap = Object.keys(data[0]).filter((it)=>{
      return it != 'x';
    })

    console.log(titleMap);

    const ds = new DataSet({
      state: {
        start: data[0].x,
        end: data[data.length -1].x,
      },
    });

    const dv = ds.createView();
    dv.source(data).transform({
      type: 'fold',
      fields: titleMap,
      key: 'key',
      value: 'value',
    });

    const cols = {
      x: {
        range: [0, 1]
      },
    }

    return (
        <Chart height={ height } data={ dv } scale={ cols } forceFit>
          <Axis name="x" />
          <Tooltip crosshairs={{type : "y"}}/>
          <Geom type="line" position="x*value" size={ borderWidth } color="key" shape="smooth"/>
          <Geom type='point' position="x*value" size={4} shape={'circle'} color={'key'} style={{ stroke: '#fff', lineWidth: 1}} />
          <Legend/>
        </Chart>
    );

  }
}
