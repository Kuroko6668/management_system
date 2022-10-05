import React, {Component} from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
后台管理的柱状图路由组件
 */
export default class Bar extends Component {
  state = {
    sales: [5, 20, 36, 10, 10, 20],
    inventorys: [15, 30, 46, 20, 20, 40]
  }
  getOption = () => {
    const {sales, inventorys} = this.state
    return { // 配置对象
      title: {
          text: 'ECharts'
      },
      tooltip: {},
      legend: {
          data:['outbound', 'inbound']
      },
      xAxis: {
          data: ["Thermometer","Tongs","Brushes","Weighing machines","Wash bottles","Spatula"]
      },
      yAxis: {},
      series: [{
          name: 'outbound',
          type: 'bar',
          data: sales
      },{
          name: 'inbound',
          type: 'bar',
          data: inventorys
      }]
  };
  }

  render() {
    return (
      <div>
        <Card title='bar一'>
          <ReactEcharts option={this.getOption()} style={{height: 300}}/>
        </Card>

      </div>
    )
  }
}