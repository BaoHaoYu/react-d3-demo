import * as d3 from 'd3'
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import * as d3scale from 'd3-scale'
import { random, range } from 'lodash-es'
import * as React from 'react'
import { data1, data2 } from '../data'
import { Tip } from './tip'

interface IProps {}

interface IState {
  showTip: boolean

  data: Array<[string, number]>

  top?: number

  left?: number

  value?: number

  index?: number
}
// https://bl.ocks.org/mbostock/431a331294d2b5ddd33f947cf4c81319
export class BaseBar extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    curve: '0',
  }
  public scaleData: any = []
  public yScale: any
  public xScale: any
  public barWidth: number
  public yaxisHeight: number = 0
  public xaxisWidth: number = 0
  public margin = { top: 30, right: 20, bottom: 30, left: 40 }

  public state: IState = {
    showTip: false,
    index: -1,
    data: range(1, 100).map((value) => [value + '', random(1, 100)]),
  }

  public componentDidMount() {
    this.init()
  }

  /**
   * 促使华
   */
  public init = (props: IProps = this.props) => {
    const svg = d3.select('#d3svg')

    // 图表宽和高
    const height: number = +svg.attr('height')
    const width: number = +svg.attr('width')
    // 图表的边距
    const margin = this.margin
    this.yaxisHeight = height - margin.top - margin.bottom
    this.xaxisWidth = width - margin.right - margin.left
    // scaleLinear为线性比例，根据一个具体的数值计算，计算该数值像素，常用于y轴
    // rangeRound对数据进行保留一位小数，这样防止了ticks模糊
    this.yScale = d3scale
      .scaleLinear()
      .domain([0, max(this.state.data, (item) => item[1])!])
      .nice()
      .rangeRound([this.yaxisHeight, 0])

    // scaleBand为序数比例尺，根据数组的长度，计算每个数组元素在range中的像素位置，长用于x轴
    this.xScale = d3scale
      .scaleBand()
      .domain(this.state.data.map((item) => item[0]))
      .range([0, this.xaxisWidth])

    // 内容控制边距
    const content = svg
      .append('g')
      .attr('class', 'content')
      .attr('transform', `translate(${margin.left},${margin.top})`)
    // axisLeft axisBottom 会生成具体的svg标签
    const yaxis = axisLeft(this.yScale).ticks(5)
    const xaxis = axisBottom(this.xScale)

    // 曲线数据，记得要用比例尺转化为像素数据
    this.scaleData = this.state.data.map((item, index) => {
      return [this.xScale(item[0]), this.yScale(item[1])]
    })
    this.barWidth = this.xScale.bandwidth() / 1.5

    // 辅助柱子容器
    const barHelp = content
      .append('g')
      .attr('class', 'barHelp')
      .attr('fill', 'white')

    // 柱子容器
    const bar = content
      .append('g')
      .attr('class', 'barContent')
      .attr('fill', 'steelblue')

    // 辅助柱子，鼠标移动到上面的时候回
    barHelp
      .selectAll('rect')
      .data(this.scaleData)
      .enter()
      .append('rect')
      .style('mix-blend-mode', 'multiply')
      .attr('x', (d: any) => d[0])
      .attr('y', 0)
      .attr('height', (d: any) => this.yaxisHeight)
      .attr('width', this.xScale.bandwidth())
      .on('mouseover', this.barMouseover)

    // 柱子
    bar
      .selectAll('rect')
      .data(this.scaleData)
      .enter()
      .append('rect')
      .on('mouseover', this.barMouseover)
      .style('mix-blend-mode', 'multiply')
      .attr('x', (d: any) => d[0] + this.barWidth / 4)
      .attr('width', this.barWidth)
      .attr('y', this.yScale(0))

      .transition()
      .duration(500)
      .delay((d, i) => (500 / this.scaleData.length) * i)
      .attr('y', (d: any, index) => d[1])
      .attr('height', (d: any) => this.yaxisHeight - d[1])

    // y轴
    content
      .append('g')
      .attr('class', 'y')
      .call(yaxis)

    // x
    content
      .append('g')
      .attr('class', 'x')
      .attr('transform', `translate(${0},${this.yaxisHeight})`)
      .call(xaxis)
  }

  /**
   * barMouseover
   */
  public barMouseover = (
    item: { name: number; value: number },
    index: number,
  ) => {
    const scaleDataItem = this.scaleData[index]
    this.setState({
      ...this.state,
      showTip: true,
      top: scaleDataItem[1],
      left: scaleDataItem[0] + this.margin.left + this.barWidth / 4,
      value: data1[index].value,
      index,
    })
  }

  /**
   * renderTip
   */
  public renderTip = () => {
    return (
      <div
        style={{
          position: 'absolute',
          top: this.state.top,
          left: this.state.left,
        }}>
        {this.state.value}
      </div>
    )
  }

  /**
   * onMouseLeave
   */
  public onMouseLeave = () => {
    this.setState({ ...this.state, showTip: false })
  }

  public render() {
    return (
      <div style={{ position: 'relative' }} onMouseLeave={this.onMouseLeave}>
        <svg className="ddd" id="d3svg" width={700} height={400} />

        <Tip
          hidden={!this.state.showTip}
          barWidth={this.barWidth}
          index={this.state.index}
          style={{
            position: 'absolute',
            left: this.state.left,
            top: this.state.top,
          }}>
          {this.state.value}
        </Tip>
      </div>
    )
  }
}
