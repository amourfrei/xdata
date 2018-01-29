/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-12-20T10:02:44+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-01-26T18:13:41+08:00
 */
 import React, { PureComponent } from 'react';
 import { connect } from 'dva';
 import { Row, Col, Icon, Card, Tabs, Table, Radio, DatePicker, Tooltip, Menu, Dropdown } from 'antd';
 import numeral from 'numeral';
 import {
   ChartCard, yuan, MiniArea, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart,Spline
 } from '../../components/Charts';
 import Trend from '../../components/Trend';
 import NumberInfo from '../../components/NumberInfo';
 import TableList from '../../components/TableList';
 import { getTimeDistance } from '../../utils/utils';

 import styles from './Realtime.less';

 const { TabPane } = Tabs;
 const { RangePicker } = DatePicker;

 const rankingListData = [];
 for (let i = 0; i < 7; i += 1) {
   rankingListData.push({
     title: `工专路 ${i} 号店`,
     total: 323234,
   });
 }

 @connect(state => ({
   chart: state.chart,
   base: state.base,
   rule: state.rule,
 }))
 export default class Realtime extends PureComponent {
   state = {
     salesType: 'all',
     currentTabKey: '',
     rangePickerValue: getTimeDistance('year'),
   }

   componentDidMount() {
     const { dispatch } = this.props;
     dispatch({
       type: 'chart/fetch',
     });
     dispatch({
       type: 'base/fetch',
     });
     dispatch({
       type: 'rule/fetch'
     });
   }

   componentWillUnmount() {
     const { dispatch } = this.props;
     dispatch({
       type: 'chart/clear',
     });
   }

   handleChangeSalesType = (e) => {
     this.setState({
       salesType: e.target.value,
     });
   }

   handleTabChange = (key) => {
     this.setState({
       currentTabKey: key,
     });
   }

   handleRangePickerChange = (rangePickerValue) => {
     this.setState({
       rangePickerValue,
     });

     this.props.dispatch({
       type: 'chart/fetchSalesData',
     });
   }

   selectDate = (type) => {
     this.setState({
       rangePickerValue: getTimeDistance(type),
     });

     this.props.dispatch({
       type: 'chart/fetchSalesData',
     });
   }

   isActive(type) {
     const { rangePickerValue } = this.state;
     const value = getTimeDistance(type);
     if (!rangePickerValue[0] || !rangePickerValue[1]) {
       return;
     }
     if (rangePickerValue[0].isSame(value[0], 'day') && rangePickerValue[1].isSame(value[1], 'day')) {
       return styles.currentDate;
     }
   }

   render() {
     const { rangePickerValue, salesType, currentTabKey } = this.state;
     const { rule: { loading: ruleLoading, data }, chart, base } = this.props;
     const {
       visitData,
       visitData2,
       salesData,
       searchData,
       offlineData,
       offlineChartData,
       salesTypeData,
       salesTypeDataOnline,
       salesTypeDataOffline,
       loading,
     } = chart;

     const {
       baseData
     } = base;

     const salesPieData = salesType === 'all' ?
       salesTypeData
       :
       (salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline);

     const menu = (
       <Menu>
         <Menu.Item>操作一</Menu.Item>
         <Menu.Item>操作二</Menu.Item>
       </Menu>
     );

     const iconGroup = (
       <span className={styles.iconGroup}>
         <Dropdown overlay={menu} placement="bottomRight">
           <Icon type="ellipsis" />
         </Dropdown>
       </span>
     );

     const salesExtra = (
       <div className={styles.salesExtraWrap}>
         <div className={styles.salesExtra}>
           <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
             今日
           </a>
           <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
             本周
           </a>
           <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
             本月
           </a>
           <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
             全年
           </a>
         </div>
         <RangePicker
           value={rangePickerValue}
           onChange={this.handleRangePickerChange}
           style={{ width: 256 }}
         />
       </div>
     );

     const columns = [
       {
         title: '排名',
         dataIndex: 'index',
         key: 'index',
       },
       {
         title: '搜索关键词',
         dataIndex: 'keyword',
         key: 'keyword',
         render: text => <a href="/">{text}</a>,
       },
       {
         title: '用户数',
         dataIndex: 'count',
         key: 'count',
         sorter: (a, b) => a.count - b.count,
         className: styles.alignRight,
       },
       {
         title: '周涨幅',
         dataIndex: 'range',
         key: 'range',
         sorter: (a, b) => a.range - b.range,
         render: (text, record) => (
           <Trend flag={record.status === 1 ? 'down' : 'up'}>
             <span style={{ marginRight: 4 }}>{text}%</span>
           </Trend>
         ),
         align: 'right',
       },
     ];

     const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

     const CustomTab = ({ data, currentTabKey: currentKey }) => (
       <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
         <Col span={12}>
           <NumberInfo
             title={data.name}
             subTitle="转化率"
             gap={2}
             total={`${data.cvr * 100}%`}
             theme={(currentKey !== data.name) && 'light'}
           />
         </Col>
         <Col span={12} style={{ paddingTop: 36 }}>
           <Pie
             animate={false}
             color={(currentKey !== data.name) && '#BDE4FF'}
             inner={0.55}
             tooltip={false}
             margin={[0, 0, 0, 0]}
             percent={data.cvr * 100}
             height={64}
           />
         </Col>
       </Row>
     );

     const topColResponsiveProps = {
       xs: 24,
       sm: 12,
       md: 12,
       lg: 12,
       xl: 6,
       style: { marginBottom: 24 },
     };

     return (
       <div>
         <Row gutter={24}>
           <Col {...topColResponsiveProps}>
             <ChartCard
               bordered={false}
               title="交易金额"
               action={<Tooltip title="交易成功的订单金额"><Icon type="info-circle-o" /></Tooltip>}
               total={yuan(baseData.nowaday && baseData.nowaday.tradeAmt)}
              //  footer={<Field label="日均销售额" value={`￥${numeral(12423).format('0,0')}`} />}
               contentHeight={46}
               className={styles.chartCardA}
             >
               <Trend flag="down">
                 日环比<span className={styles.trendText}>{ baseData.nowaday && (baseData.nowaday.tradeAmt / baseData.contrastive.tradeAmt) }%</span>
               </Trend>
             </ChartCard>
           </Col>
           <Col {...topColResponsiveProps}>
             <ChartCard
               bordered={false}
               title="交易笔数"
               action={<Tooltip title="交易成功的订单笔数"><Icon type="info-circle-o" /></Tooltip>}
               total={numeral(baseData.nowaday && baseData.nowaday.tradeCnt).format('0,0')}
              //  footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
               contentHeight={46}
               className={styles.chartCardB}
             >
             <Trend flag="down">
               日环比<span className={styles.trendText}>{ baseData.nowaday && (baseData.nowaday.tradeCnt / baseData.contrastive.tradeCnt) }%</span>
             </Trend>
             </ChartCard>
           </Col>
           <Col {...topColResponsiveProps}>
             <ChartCard
               bordered={false}
               title="成交用户数"
               action={<Tooltip title="交易成功的京东用户数"><Icon type="info-circle-o" /></Tooltip>}
               total={numeral(baseData.nowaday && baseData.nowaday.tradeUsers).format('0,0')}
              //  footer={<Field label="转化率" value="60%" />}
               contentHeight={46}
               className={styles.chartCardC}
             >
             <Trend flag="down">
               日环比<span className={styles.trendText}>{baseData.nowaday && (baseData.nowaday.tradeUsers / baseData.contrastive.tradeUsers)}%</span>
             </Trend>
             </ChartCard>
           </Col>
           <Col {...topColResponsiveProps}>
             <ChartCard
               bordered={false}
               title="客单价"
               action={<Tooltip title="交易金额/成交用户"><Icon type="info-circle-o" /></Tooltip>}
               total={baseData.nowaday && (baseData.nowaday.tradeAmt / baseData.nowaday.tradeUsers)}
               className={styles.chartCardD}
              //  footer={
              //    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              //      <Trend flag="up" style={{ marginRight: 16 }}>
              //        周同比<span className={styles.trendText}>12%</span>
              //      </Trend>
              //      <Trend flag="down">
              //        日环比<span className={styles.trendText}>11%</span>
              //      </Trend>
              //    </div>
              //  }
               contentHeight={46}
             >
             <Trend flag="down">
               日环比<span className={styles.trendText}>{baseData.nowaday && ((baseData.nowaday.tradeAmt / baseData.nowaday.tradeUsers) / (baseData.contrastive.tradeAmt / baseData.contrastive.tradeUsers))}%</span>
             </Trend>
             </ChartCard>
           </Col>
         </Row>

         <Card
           title="支付方式"
           loading={loading}
           bordered={false}
           bodyStyle={{ padding: 0 }}
         >
           <div className={styles.salesCard}>
             <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
               <TabPane tab="交易金额" key="amount">
               <Row>
                 <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                 <Pie
                   hasLegend
                   subTitle="支付方式"
                   total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                   data={salesPieData}
                   valueFormat={val => yuan(val)}
                   height={248}
                   lineWidth={4}
                 />
                 </Col>
                 <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     <Spline/>
                   </div>
                   </div>
                 </Col>
               </Row>
               </TabPane>
               <TabPane tab="交易笔数" key="count">
               <Row>
                 <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                 <Pie
                   hasLegend
                   subTitle="支付方式"
                   total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                   data={salesPieData}
                   valueFormat={val => yuan(val)}
                   height={248}
                   lineWidth={4}
                 />
                 </Col>
                 <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     <Spline/>
                   </div>
                   </div>
                 </Col>
               </Row>
               </TabPane>
               <TabPane tab="客单价" key="price">
               <Row>
                 <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                 <Pie
                   hasLegend
                   subTitle="支付方式"
                   total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                   data={salesPieData}
                   valueFormat={val => yuan(val)}
                   height={248}
                   lineWidth={4}
                 />
                 </Col>
                 <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     <Spline/>
                   </div>
                   </div>
                 </Col>
               </Row>
               </TabPane>
               <TabPane tab="成交用户数" key="users">
                 <Row>
                   <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                   <Pie
                     hasLegend
                     subTitle="支付工具"
                     total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                     data={salesPieData}
                     valueFormat={val => yuan(val)}
                     height={248}
                     lineWidth={4}
                   />
                   </Col>
                   <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                     <div className={styles.salesBar}>
                     <div style={{ padding: '0 24px' }}>
                      <Spline/>
                     </div>
                     </div>
                   </Col>
                 </Row>
               </TabPane>
             </Tabs>
           </div>
         </Card>


         <Card
           title="支付工具"
           loading={loading}
           bordered={false}
           bodyStyle={{ padding: 0,marginTop:'20px' }}
         >
           <div className={styles.salesCard}>
             <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
               <TabPane tab="支付金额" key="amount">
               <Row>
                 <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                 <Pie
                   hasLegend
                   subTitle="支付方式"
                   total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                   data={salesPieData}
                   valueFormat={val => yuan(val)}
                   height={248}
                   lineWidth={4}
                 />
                 </Col>
                 <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     <Spline/>
                   </div>
                   </div>
                 </Col>
               </Row>
               </TabPane>
               <TabPane tab="支付笔数" key="count">
               <Row>
                 <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                 <Pie
                   hasLegend
                   subTitle="支付方式"
                   total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                   data={salesPieData}
                   valueFormat={val => yuan(val)}
                   height={248}
                   lineWidth={4}
                 />
                 </Col>
                 <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     <Spline/>
                   </div>
                   </div>
                 </Col>
               </Row>
               </TabPane>
               <TabPane tab="客单价" key="price">
               <Row>
                 <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                 <Pie
                   hasLegend
                   subTitle="支付方式"
                   total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                   data={salesPieData}
                   valueFormat={val => yuan(val)}
                   height={248}
                   lineWidth={4}
                 />
                 </Col>
                 <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     <Spline/>
                   </div>
                   </div>
                 </Col>
               </Row>
               </TabPane>
               <TabPane tab="成交用户数" key="users">
                 <Row>
                   <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                   <Pie
                     hasLegend
                     subTitle="支付工具"
                     total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                     data={salesPieData}
                     valueFormat={val => yuan(val)}
                     height={248}
                     lineWidth={4}
                   />
                   </Col>
                   <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                     <div className={styles.salesBar}>
                     <div style={{ padding: '0 24px' }}>
                      <Spline/>
                     </div>
                     </div>
                   </Col>
                 </Row>
               </TabPane>
             </Tabs>
           </div>
         </Card>

         <Card
          loading={loading}
          bordered={false}
          bodyStyle={{ padding: '20px',marginTop:'20px' }}
         >
          <TableList/>
         </Card>
       </div>
     );
   }
 }
