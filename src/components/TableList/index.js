/**
 * @Author: Chen Ming <amour>
 * @Date:   2018-01-26T16:30:20+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2018-02-01T14:23:36+08:00
 */
import React,{ PureComponent } from 'react';
import { Table } from 'antd';
import numeral from 'numeral';
import { getPayType } from '../../utils/utils';
import reqwest from 'reqwest';
export default class TableList extends PureComponent{

      state = {
        data: [],
        pagination: {},
        loading: false
      }

      handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
          pagination: pager,
        });
        this.fetch({

        });
      }

      fetch = (params = {}) => {
        // this.setState({loading: true});
        // reqwest({
        //   url: '',
        //   method: 'get',
        //   type: 'jsonp',
        //   success: function(){
        //
        //   }
        // }).then((data)=>{
        //   const pagination = { ...this.state.pagination };
        //   pagination.total = 200;
        //   this.setState({
        //     loading: false,
        //     data: data.bizData,
        //     pagination
        //   });
        // });
      }

      componentDidMount(){
        this.fetch();
      }
  render(){
    const bizData = {
	"bizData": [{
		"date": "2018011600",
		"payTool": 0,
		"tradeAmount": 20,
		"tradeCount": 5,
		"tradeUsers": 20
	}, {
		"date": "2018011600",
		"payTool": 1,
		"tradeAmount": 20,
		"tradeCount": 5,
		"tradeUsers": 20
	}, {
		"date": "2018011601",
		"payTool": 0,
		"tradeAmount": 20,
		"tradeCount": 5,
		"tradeUsers": 20
	}, {
		"date": "2018011602",
		"payTool": 2,
		"tradeAmount": 20,
		"tradeCount": 5,
		"tradeUsers": 20
	}],
	"code": "000000",
	"info": "success",
	"isSuccess": "true"
};
    const columns = [{
      title: '时间',
      dataIndex: 'date',
      key: 'date',
      render: text => <a href="#">{text}</a>,
    },{
      title: '交易金额',
      dataIndex: 'tradeAmount',
      key: 'tradeAmount',
    },{
      title: '交易笔数',
      dataIndex: 'tradeCount',
      key: 'tradeCount',
    },{
      title: '成交用户数',
      dataIndex: 'tradeUsers',
      key: 'tradeUsers'
    },
    {
      title: '客单价',
      dataIndex: 'customAmount',
      key: 'customAmount'
    },
    {
      title: '支付方式',
      dataIndex: 'payTool',
      key: 'payTool'
    }
  ];

    const data = bizData.bizData;
    data.forEach((item, index)=>{
      item.tradeAmount = numeral(item.tradeAmount).format('0,0.00');
      item.customAmount = numeral(item.tradeAmount / item.tradeUsers).format('0,0.00');
      item.payTool = getPayType(item.payTool);
    });
    this.state.pagination = {
      current: 1,
      total: 100,
      pageSize: 10
    }
    return (
      <Table rowKey={(record, index) => index}
        bordered={true}
        columns={ columns }
        dataSource={ data }
        loading={this.state.loading}
        pagination={this.state.pagination}
        // onChange={this.handleTableChange}
      />
    );

  }
}
