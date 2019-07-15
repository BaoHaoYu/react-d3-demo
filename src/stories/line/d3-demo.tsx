import { curveCatmullRom, curveMonotoneX, line, select } from 'd3'
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleBand, scaleLinear } from 'd3-scale'
import * as React from 'react'
import {  } from "lodash-es";


interface IProps {
  curve: any
}

// https://bl.ocks.org/mbostock/431a331294d2b5ddd33f947cf4c81319
export class D3Demo extends React.Component<IProps> {
  public lineData: any

  static defaultProps:Partial<IProps> = {
    curve: curveMonotoneX
  }

  public componentDidMount() {
    this.init()
  }

  /**
   * com
   */
  public componentWillReceiveProps(pre:IProps, next:IProps) {
    if(this.props)
  }

  /**
   * 促使华
   */
  public init = () => {
    // 数据
    const data: number[] = [820, 932, 400, 400, 1290, 1330, 1320]
    const time: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    // 图表宽和高
    const height: number = +select('#d3svg').attr('height')
    const width: number = +select('#d3svg').attr('width')
    // 图表的边距
    const margin = { top: 30, right: 20, bottom: 30, left: 40 }
    // scaleLinear为线性比例，根据一个具体的数值计算，计算该数值像素，常用于y轴
    // rangeRound对数据进行保留一位小数，这样防止了ticks模糊
    const yScale = scaleLinear()
      .domain([0, max(data)!])
      .rangeRound([height - margin.top - margin.bottom, margin.left])

    // scaleBand为序数比例尺，根据数组的长度，计算每个数组元素在range中的像素位置，长用于x轴
    const xScale = scaleBand()
      .domain(time)
      .rangeRound([0, width - margin.right - margin.left])
      .paddingInner(1)
      .paddingOuter(0)

    // axisLeft axisBottom 会生成具体的svg标签
    const y = axisLeft(yScale).ticks(5)
    const x = axisBottom(xScale)

    // 加入y轴，使用transform属性改变位置
    select('#d3svg')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(y)

    // 加入x轴
    select('#d3svg')
      .append('g')
      .attr(
        'transform',
        'translate(' + margin.left + ',' + (height - margin.bottom) + ')',
      )
      .call(x)

    // 曲线数据，记得要用比例尺转化为像素数据
    this.lineData = time.map((item, index) => {
      return [xScale(item), yScale(data[index])]
    })
    // 光滑请看 https://github.com/d3/d3-shape/blob/v1.3.4/README.md#curveCatmullRom_alpha
    const newLine = line().curve(this.props.curve)

    select('#d3svg')
      .datum(data)
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr(
        'transform',
        `translate(${margin.left + xScale.bandwidth() / 2!},${margin.top})`,
      )
      .attr('d', () => {
        return newLine(this.lineData)
      })
  }

  // 修改path的d属性
  public changeType0 = () => {
    const newLine = line()

    select('#d3svg .line').attr('d', (data) => {
      return newLine(this.lineData)
    })
  }

  // 修改path的d属性
  public changeType1 = () => {
    const newLine = line().curve(curveCatmullRom)

    select('#d3svg .line').attr('d', (data) => {
      return newLine(this.lineData)
    })
  }

  // 修改path的d属性
  public changeType2 = () => {
    const newLine = line().curve(curveMonotoneX)

    select('#d3svg .line').attr('d', (data) => {
      return newLine(this.lineData)
    })
  }
  public render() {
    return (
      <div>
        <svg
          style={{ marginLeft: 20 }}
          className="ddd"
          id="d3svg"
          width={700}
          height={600}
        />
        <button onClick={this.changeType0}>曲线类型:直线</button>

        <button onClick={this.changeType1}>曲线类型:curveCatmullRom</button>

        <button onClick={this.changeType2}>曲线类型:curveMonotoneX</button>
      </div>
    )
  }
}