import * as d3 from 'd3'
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import * as d3scale from 'd3-scale'
import $ from 'jquery'
import { isEqual } from 'lodash-es'
import * as React from 'react'
import { data1 } from '../data'

interface IProps {}

// https://bl.ocks.org/mbostock/431a331294d2b5ddd33f947cf4c81319
export class BaseBar extends React.Component<IProps> {
  public static defaultProps: Partial<IProps> = {
    curve: '0',
  }
  public scaleData: any

  public componentDidMount() {
    this.init()
  }

  /**
   * com
   */
  public componentWillReceiveProps(next: IProps) {
    if (!isEqual(this.props, next)) {
      this.init(next)
    }
  }

  /**
   * 促使华
   */
  public init = (props: IProps = this.props) => {
    $('#d3svg').empty()
    const svg = d3.select('#d3svg')

    // 图表宽和高
    const height: number = +svg.attr('height')
    const width: number = +svg.attr('width')
    // 图表的边距
    const margin = { top: 30, right: 20, bottom: 30, left: 40 }
    const yaxisHeight = height - margin.top - margin.bottom
    const xaxisWidth = width - margin.right - margin.left
    // scaleLinear为线性比例，根据一个具体的数值计算，计算该数值像素，常用于y轴
    // rangeRound对数据进行保留一位小数，这样防止了ticks模糊
    const yScale = d3scale
      .scaleLinear()
      .domain([0, max(data1, (item) => item.value)!])
      .nice()
      .rangeRound([yaxisHeight, 0])

    // scaleBand为序数比例尺，根据数组的长度，计算每个数组元素在range中的像素位置，长用于x轴
    const xScale = d3scale
      .scaleBand()
      .domain(data1.map((item) => item.name))
      .range([0, xaxisWidth])

    // 内容控制边距
    const content = svg
      .append('g')
      .attr('class', 'content')
      .attr('transform', `translate(${margin.left},${margin.top})`)
    // axisLeft axisBottom 会生成具体的svg标签
    const yaxis = axisLeft(yScale).ticks(5)
    const xaxis = axisBottom(xScale)

    // 曲线数据，记得要用比例尺转化为像素数据
    this.scaleData = data1.map((item, index) => {
      return {
        name: xScale(item.name),
        value: yScale(item.value),
      }
    })
    const barWidth = xScale.bandwidth() / 1.5

    content
      .append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(this.scaleData)
      .enter()
      .append('rect')
      .style('mix-blend-mode', 'multiply')
      .attr('value', (d: any, index) => data1[index].value)
      .attr('x', (d: any) => d.name + barWidth / 4)
      .attr('y', (d: any, index) => d.value)
      .attr('height', (d: any) => yaxisHeight - d.value)
      .attr('width', barWidth)

    content
      .append('g')
      .attr('class', 'y')
      .call(yaxis)

    // 加入x轴
    content
      .append('g')
      .attr('class', 'x')
      .attr('transform', `translate(${0},${yaxisHeight})`)
      .call(xaxis)
  }

  public render() {
    return (
      <div>
        <svg className="ddd" id="d3svg" width={700} height={400} />
      </div>
    )
  }
}
