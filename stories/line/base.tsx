import { area, curveCatmullRom, curveMonotoneX, select } from 'd3'
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import * as d3scale from 'd3-scale'
import $ from 'jquery'
import { isEqual } from 'lodash-es'
import * as React from 'react'
import { data, time } from '../data'

interface IProps {
  curve: any
  paddingInner: number
  paddingOuter: number
}

const listcurve = {
  '0': curveMonotoneX,
  '1': curveCatmullRom,
}

// https://bl.ocks.org/mbostock/431a331294d2b5ddd33f947cf4c81319
export class BaseLine extends React.Component<IProps> {
  public static defaultProps: Partial<IProps> = {
    curve: '0',
  }
  public lineData: any

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
    // 图表宽和高
    const height: number = +select('#d3svg').attr('height')
    const width: number = +select('#d3svg').attr('width')
    // 图表的边距
    const margin = { top: 30, right: 20, bottom: 30, left: 40 }
    // scaleLinear为线性比例，根据一个具体的数值计算，计算该数值像素，常用于y轴
    // rangeRound对数据进行保留一位小数，这样防止了ticks模糊
    const yScale = d3scale
      .scaleLinear()
      .domain([0, max(data)!])
      .rangeRound([height - margin.top - margin.bottom, margin.left])

    // scaleBand为序数比例尺，根据数组的长度，计算每个数组元素在range中的像素位置，长用于x轴
    const xScale = d3scale
      .scalePoint()
      .domain(time)
      .range([0, width - margin.right - margin.left])

    // axisLeft axisBottom 会生成具体的svg标签
    const yaxis = axisLeft(yScale).ticks(5)
    const xaxis = axisBottom(xScale)

    // 曲线数据，记得要用比例尺转化为像素数据
    this.lineData = time.map((item, index) => {
      return [xScale(item), yScale(data[index])]
    })
    // 光滑请看 https://github.com/d3/d3-shape/blob/v1.3.4/README.md#curveCatmullRom_alpha
    const newLineCreate = area()
      .x((d) => {
        return d[0]
      })
      // 曲线y0 和曲线y1形成的区域就是面积了
      .y0((d) => {
        return d[1]
      })
      .curve(listcurve[props.curve])

    // 添加曲线
    select('#d3svg')
      .datum(data)
      .append('path')
      .attr('class', 'line')
      .attr('fill', 'steelblue')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr(
        'transform',
        `translate(${margin.left + xScale.bandwidth() / 2!},${margin.top})`,
      )
      .attr('d', () => {
        return newLineCreate(this.lineData)
      })

    // 加入y轴，使用transform属性改变位置
    select('#d3svg')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(yaxis)

    // 加入x轴
    select('#d3svg')
      .append('g')
      .attr(
        'transform',
        'translate(' + margin.left + ',' + (height - margin.bottom) + ')',
      )
      .call(xaxis)
  }

  public render() {
    return (
      <div>
        <svg
          style={{ marginLeft: 20 }}
          className="ddd"
          id="d3svg"
          width={700}
          height={500}
        />
      </div>
    )
  }
}
