/**
 * @Author: Chen Ming <amour>
 * @Date:   2018-01-24T10:29:52+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-01-25T17:46:17+08:00
 */



import React, { Component } from 'react';
import { Chart, Tooltip, Geom, Coord, Axis, Legend, Label } from 'bizcharts';
import { DataView } from '@antv/data-set';
import { Divider } from 'antd';
import classNames from 'classnames';
import ReactFitText from 'react-fittext';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from '../autoHeight';

import styles from './index.less';

/* eslint react/no-danger:0 */
@autoHeight()
export default class Pie extends Component {
  state = {
    legendData: [],
    legendBlock: false,
  };

  componentDidMount() {
    this.getLengendData();
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.getLengendData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    this.resize.cancel();
  }

  getG2Instance = (chart) => {
    this.chart = chart;
  };

  // for custom lengend view
  getLengendData = () => {
    if (!this.chart) return;
    const geom = this.chart.getAllGeoms()[0]; // 获取所有的图形
    const items = geom.get('dataArray') || []; // 获取图形对应的

    const legendData = items.map((item) => {
      /* eslint no-underscore-dangle:0 */
      const origin = item[0]._origin;
      origin.color = item[0].color;
      origin.checked = true;
      return origin;
    });

    this.setState({
      legendData,
    });
  };

  // for window resize auto responsive legend
  @Bind()
  @Debounce(300)
  resize() {
    const { hasLegend } = this.props;
    if (!hasLegend || !this.root) {
      window.removeEventListener('resize', this.resize);
      return;
    }
    if (this.root.parentNode.clientWidth <= 380) {
      if (!this.state.legendBlock) {
        this.setState({
          legendBlock: true,
        });
      }
    } else if (this.state.legendBlock) {
      this.setState({
        legendBlock: false,
      });
    }
  }

  handleRoot = (n) => {
    this.root = n;
  };

  handleLegendClick = (item, i) => {
    const newItem = item;
    newItem.checked = !newItem.checked;

    const { legendData } = this.state;
    legendData[i] = newItem;

    const filteredLegendData = legendData.filter(l => l.checked).map(l => l.x);

    if (this.chart) {
      this.chart.filter('x', val => filteredLegendData.indexOf(val) > -1);
    }

    this.setState({
      legendData,
    });
  };

  render() {
    const {
      valueFormat,
      subTitle,
      total,
      hasLegend = false,
      className,
      style,
      height,
      forceFit = true,
      percent = 0,
      color,
      inner = 0.6,
      animate = true,
      colors,
      lineWidth = 1,
    } = this.props;

    const { legendData, legendBlock } = this.state;
    const pieClassName = classNames(styles.pie, className, {
      [styles.hasLegend]: !!hasLegend,
      [styles.legendBlock]: legendBlock,
    });

    const defaultColors = colors;
    let data = [
          { item: '事例一', count: 40 },
          { item: '事例二', count: 21 },
          { item: '事例三', count: 17 },
          { item: '事例四', count: 13 },
          { item: '事例五', count: 9 }
        ];
    let selected = this.props.selected || true;
    let tooltip = this.props.tooltip || true;
    let formatColor;

    const scale = {
      x: {
        type: 'cat',
        range: [0, 1],
      },
      y: {
        min: 0,
      },
    };

    if (percent) {
      selected = false;
      tooltip = false;
      formatColor = (value) => {
        if (value === '占比') {
          return color || 'rgba(24, 144, 255, 0.85)';
        } else {
          return '#F0F2F5';
        }
      };

      data = [
        {
          x: '占比',
          y: parseFloat(percent),
        },
        {
          x: '反比',
          y: 100 - parseFloat(percent),
        },
      ];
    }

    const tooltipFormat = [
      'x*percent',
      (x, p) => ({
        name: x,
        value: `${(p * 100).toFixed(2)}%`,
      }),
    ];

    const padding = [12, 0, 12, 0];

    const dv = new DataView();
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });

    const cols = {
      percent: {
      formatter: val => {
        val = (val * 100) + '%';
          return val;
        }
      }
    }

    return (
      <div ref={this.handleRoot} className={pieClassName} style={style}>
      <Chart height={500} data={dv} scale={cols} forceFit>
          <Coord type='theta' radius={0.75} />
          <Axis name="percent" />
          <Legend position='bottom'/>
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            />
          <Geom
            type="intervalStack"
            position="percent"
            color='item'
            tooltip={['item*percent',(item, percent) => {
              percent = percent * 100 + '%';
              return {
                name: item,
                value: percent
              };
            }]}
            style={{lineWidth: 1,stroke: '#fff'}}
            >
            <Label content='percent' formatter={(val, item) => {
                return item.point.item + ': ' + val;}} />
          </Geom>
        </Chart>
      </div>
    );
  }
}
