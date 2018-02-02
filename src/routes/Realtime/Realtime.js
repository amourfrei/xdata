/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-12-20T10:02:44+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-02-02T17:44:18+08:00
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


 @connect(state => ({
   base: state.base,
   pay: state.pay,
   hours: state.hours,
 }))
 export default class Realtime extends PureComponent {

   componentDidMount() {
     const { dispatch } = this.props;
     dispatch({
       type: 'base/fetch',
     });
     dispatch({
       type: 'pay/fetch'
     });
     dispatch({
       type: 'hours/fetch'
     });
   }

   componentWillUnmount() {
     const { dispatch } = this.props;
     dispatch({
       type: 'base/clear',
     });
     dispatch({
       type: 'pay/clear'
     });
     dispatch({
       type: 'hours/clear'
     });
   }


   render() {
     const { base, pay, hours, loading } = this.props;
     const {
       baseData
     } = base;

     let piePayAmout = [],
         piePayCount = [],
         pieCustomAmount = [],
         pieCustomUsers = [];
     let spPayAmout = [],
         spPayCount = [],
         spCustomAmount = [],
         spCustomUsers = [];
     let hourPayAmout = [],
         hourPayCount = [],
         hourCustomAmount = [],
         hourCustomUsers = [];
     if(pay.loading === false){
       //交易金额
       let payAmountOrigin = pay.payTypeData['A'];
       for(let p in payAmountOrigin){
         let tempVals = Object.values(payAmountOrigin[p]).reduce((prev, next)=>{
           return prev + next;
         });
         piePayAmout.push({item: p, count: tempVals});
       }
       //交易笔数
       let payCountOrigin = pay.payTypeData['B'];
       for(let p in payCountOrigin){
         let tempVals = Object.values(payCountOrigin[p]).reduce((prev, next)=>{
           return prev + next;
         });
         piePayCount.push({item: p, count: tempVals});
       }
       //成交用户数
       let customUsersOrigin = pay.payTypeData['C'];
       for(let p in customUsersOrigin){
         let tempVals = Object.values(customUsersOrigin[p]).reduce((prev, next)=>{
           return prev + next;
         });
         pieCustomUsers.push({item: p, count: tempVals});
       }
       //客单价
      //  let customAmountOrigin = pay.payTypeData['B'];
       for(let p in customUsersOrigin){
         let tempVals = Object.values(customUsersOrigin[p]).reduce((prev, next)=>{
           return prev + next;
         });
         let tempValsAmount = Object.values(payAmountOrigin[p]).reduce((prev, next)=>{
           return prev + next;
         });
         pieCustomAmount.push({item: p, count: tempValsAmount / tempVals});
       }

       //for spline.
      //交易金额
      let dateTempA = Object.keys(Object.values(payAmountOrigin)[0]);
      dateTempA.forEach((item, index)=>{
        let obj = {};
        Object.keys(payAmountOrigin).forEach((i, x)=>{
          obj[i] = payAmountOrigin[i][item];
        });
        obj['x'] = item;
        spPayAmout.push(obj);
      });

      //交易笔数
      let dateTempB = Object.keys(Object.values(payCountOrigin)[0]);
      dateTempB.forEach((item, index)=>{
        let obj = {};
        Object.keys(payCountOrigin).forEach((i, x)=>{
          obj[i] = payCountOrigin[i][item];
        });
        obj['x'] = item;
        spPayCount.push(obj);
      });

      //成交用户数
      let dateTempC = Object.keys(Object.values(customUsersOrigin)[0]);
      dateTempC.forEach((item, index)=>{
        let obj = {};
        Object.keys(customUsersOrigin).forEach((i, x)=>{
          obj[i] = customUsersOrigin[i][item];
        });
        obj['x'] = item;
        spCustomUsers.push(obj);
      });

      //客单价
      let dateTempD = Object.keys(Object.values(payAmountOrigin)[0]);
      dateTempD.forEach((item, index)=>{
        let obj = {};
        Object.keys(payAmountOrigin).forEach((i, x)=>{
          obj[i] = payAmountOrigin[i][item] / customUsersOrigin[i][item];
        });
        obj['x'] = item;
        spCustomAmount.push(obj);
      });

     }

     //小时指标数据计算
     if(hours.loading === false){
       //交易金额
       let hPayAmoutOrigin =  hours.hoursData['A'],
           hPayCountOrigin = hours.hoursData['B'],
           hCustomUsersOrigin = hours.hoursData['C'];
      let dateTempA = Object.keys(hPayAmoutOrigin);
      dateTempA.forEach((item, index)=>{
        let obj = {};
        obj['x'] = item;
        obj['今天'] = hPayAmoutOrigin[item];
        hourPayAmout.push(obj);
      });
      //支付笔数
      let dateTempB = Object.keys(hPayCountOrigin);
      dateTempA.forEach((item, index)=>{
        let obj = {};
        obj['x'] = item;
        obj['今天'] = hPayCountOrigin[item];
        hourPayCount.push(obj);
      });
      //成交用户数
      let dateTempC = Object.keys(hCustomUsersOrigin);
      dateTempA.forEach((item, index)=>{
        let obj = {};
        obj['x'] = item;
        obj['今天'] = hPayAmoutOrigin[item];
        hourCustomUsers.push(obj);
      });
      //客单价
      dateTempA.forEach((item, index)=>{
        let obj = {};
        obj['x'] = item;
        obj['今天'] = hPayAmoutOrigin[item] / hPayAmoutOrigin[item];
        hourCustomAmount.push(obj);
      });

     }
     console.error(hourPayAmout);
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
          <Col>
            <Card
              title={<div><span style={{marginRight: '20px'}}>实时数据：12:00:00</span>  <Tooltip title="数据截至上一个整点时段"><Icon type="info-circle-o" /></Tooltip></div>}
              loading={loading}
              bordered={false}
              style={{ padding: 0, marginBottom: '20px' }}
            />
          </Col>
        </Row>
        {baseData.nowaday &&
         <Row gutter={24}>
           <Col {...topColResponsiveProps}>
             <ChartCard
               bordered={false}
               title="交易金额"
               action={<Tooltip title="交易成功的订单金额"><Icon type="info-circle-o" /></Tooltip>}
               total={yuan(baseData.nowaday.tradeAmt)}
               contentHeight={46}
               className={styles.chartCardA}
             >
               <Trend flag={baseData.nowaday.tradeAmt - baseData.contrastive.tradeAmt >= 0 ? 'up' : 'down'}>
                 日环比<span className={styles.trendText}>{ numeral(Math.abs(baseData.nowaday.tradeAmt - baseData.contrastive.tradeAmt) / baseData.contrastive.tradeAmt).format('0.00') }%</span>
               </Trend>
             </ChartCard>
           </Col>
           <Col {...topColResponsiveProps}>
             <ChartCard
               bordered={false}
               title="交易笔数"
               action={<Tooltip title="交易成功的订单笔数"><Icon type="info-circle-o" /></Tooltip>}
               total={numeral(baseData.nowaday.tradeCnt).format('0')}
               contentHeight={46}
               className={styles.chartCardB}
             >
             <Trend flag={baseData.nowaday.tradeCnt - baseData.contrastive.tradeCnt >= 0 ? 'up' : 'down'}>
               日环比<span className={styles.trendText}>{ numeral(Math.abs(baseData.nowaday.tradeCnt - baseData.contrastive.tradeCnt) / baseData.contrastive.tradeCnt).format('0.00') }%</span>
             </Trend>
             </ChartCard>
           </Col>
           <Col {...topColResponsiveProps}>
             <ChartCard
               bordered={false}
               title="成交用户数"
               action={<Tooltip title="交易成功的京东用户数"><Icon type="info-circle-o" /></Tooltip>}
               total={numeral(baseData.nowaday.tradeUsers).format('0,0')}
               contentHeight={46}
               className={styles.chartCardC}
             >
             <Trend flag={baseData.nowaday.tradeUsers - baseData.contrastive.tradeUsers >= 0 ? 'up' : 'down'}>
               日环比<span className={styles.trendText}>{numeral(Math.abs(baseData.nowaday.tradeUsers - baseData.contrastive.tradeUsers) / baseData.contrastive.tradeUsers).format('0.00')}%</span>
             </Trend>
             </ChartCard>
           </Col>
           <Col {...topColResponsiveProps}>
             <ChartCard
               bordered={false}
               title="客单价"
               action={<Tooltip title="交易金额/成交用户"><Icon type="info-circle-o" /></Tooltip>}
               total={yuan(baseData.nowaday.tradeAmt / baseData.nowaday.tradeUsers)}
               className={styles.chartCardD}
               contentHeight={46}
             >
             <Trend flag={(baseData.nowaday.tradeAmt / baseData.nowaday.tradeUsers) - (baseData.contrastive.tradeAmt / baseData.contrastive.tradeUsers) >=0 ? 'up' : 'down'}>
               日环比<span className={styles.trendText}>{numeral(Math.abs((baseData.nowaday.tradeAmt / baseData.nowaday.tradeUsers) - (baseData.contrastive.tradeAmt / baseData.contrastive.tradeUsers)) / (baseData.contrastive.tradeAmt / baseData.contrastive.tradeUsers)).format('0.00')}%</span>
             </Trend>
             </ChartCard>
           </Col>
         </Row>
         }
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
                   height={248}
                   lineWidth={4}
                   data={ piePayAmout }
                 />
                 </Col>
                 <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     { spPayAmout.length > 0 && <Spline data={ spPayAmout }/>}
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
                   valueFormat={val => yuan(val)}
                   height={248}
                   lineWidth={4}
                   data = { piePayCount }
                 />
                 </Col>
                 <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     {spPayCount.length > 0 && <Spline data={ spPayCount }/>}
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
                   height={248}
                   lineWidth={4}
                   data = { pieCustomAmount }
                 />
                 </Col>
                 <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                    {spCustomAmount.length > 0 && <Spline data={ spCustomAmount }/>}
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
                     height={248}
                     lineWidth={4}
                     data={ pieCustomUsers }
                   />
                   </Col>
                   <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                     <div className={styles.salesBar}>
                     <div style={{ padding: '0 24px' }}>
                      { spCustomUsers.length > 0 && <Spline data={ spCustomUsers }/> }
                     </div>
                     </div>
                   </Col>
                 </Row>
               </TabPane>
             </Tabs>
           </div>
         </Card>


         <Card
           title="小时指标"
           loading={loading}
           bordered={false}
           bodyStyle={{ padding: 0 }}
           style={{ padding: 0,marginTop:'20px' }}
         >
           <div className={styles.salesCard}>
             <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
               <TabPane tab="支付金额" key="amount">
               <Row>
                 <Col xl={24} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     {hourPayAmout.length > 0 && <Spline data={ hourPayAmout }/>}
                   </div>
                   </div>
                 </Col>
               </Row>
               </TabPane>
               <TabPane tab="支付笔数" key="count">
               <Row>
                 <Col xl={24} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     { hourPayCount.length > 0 && <Spline data={ hourPayCount }/>}
                   </div>
                   </div>
                 </Col>
               </Row>
               </TabPane>
               <TabPane tab="客单价" key="price">
               <Row>
                 <Col xl={24} lg={12} md={12} sm={24} xs={24}>
                   <div className={styles.salesBar}>
                   <div style={{ padding: '0 24px' }}>
                     { hourCustomAmount.length > 0 && <Spline data={ hourCustomAmount }/> }
                   </div>
                   </div>
                 </Col>
               </Row>
               </TabPane>
               <TabPane tab="成交用户数" key="users">
                 <Row>
                   <Col xl={24} lg={12} md={12} sm={24} xs={24}>
                     <div className={styles.salesBar}>
                     <div style={{ padding: '0 24px' }}>
                      { hourCustomUsers.length > 0 && <Spline data={ hourCustomUsers }/> }
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
