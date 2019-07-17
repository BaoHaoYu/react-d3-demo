import * as d3 from 'd3'
import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import * as d3scale from 'd3-scale'
import { map } from 'lodash-es'
import * as React from 'react'
import { Tip } from '../tip'

interface IProps {
  data: Array<[number | string, number]>

  flag: any
}

interface IState {
  showTip: boolean

  top?: number

  left?: number

  value?: number

  index?: number

  scaleData?: any[]
}
// https://bl.ocks.org/mbostock/431a331294d2b5ddd33f947cf4c81319
export class UseReact extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {}
  public scaleData: any = []

  public barWidth: number

  public margin = { top: 30, right: 20, bottom: 30, left: 40 }

  public yaxisHeight: number = 0
  public xaxisWidth: number = 0

  public yScale: any
  public xScale: any

  public xSelect: any
  public ySelect: any

  public state: IState = {
    showTip: false,
    index: -1,
    scaleData: [],
  }

  public componentDidMount() {
    this.init()
    this.forceUpdate()
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
      .domain([0, max(props.data, (item) => item[1])!])
      .nice()
      .rangeRound([this.yaxisHeight, 0])

    // scaleBand为序数比例尺，根据数组的长度，计算每个数组元素在range中的像素位置，长用于x轴
    this.xScale = d3scale
      .scaleBand()
      .domain(props.data.map((item) => item[0] + ''))
      .range([0, this.xaxisWidth])

    // axisLeft axisBottom 会生成具体的svg标签
    const yaxis = axisLeft(this.yScale).ticks(5)
    const xaxis = axisBottom(this.xScale)

    // 曲线数据，记得要用比例尺转化为像素数据
    this.scaleData = props.data.map((item, index) => {
      return [this.xScale(item[0]), this.yScale(item[1])]
    })
    this.barWidth = this.xScale.bandwidth() / 1.5
    // y轴
    this.ySelect = d3
      .create('g')
      .attr('class', 'yaxis')
      .call(yaxis)

    // x轴
    this.xSelect = d3
      .create('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(${0},${this.yaxisHeight})`)
      .call(xaxis)
  }

  public componentDidUpdate(prevProps: IProps) {
    if (this.props.flag !== prevProps.flag) {
      this.init()
      this.forceUpdate()
    }
  }

  /**
   * barMouseover
   */
  public barMouseover = (item: [number, number], index: number) => {
    const scaleDataItem = this.scaleData[index]
    this.setState({
      ...this.state,
      showTip: true,
      top: scaleDataItem[1],
      left: scaleDataItem[0] + this.margin.left + this.barWidth / 4,
      value: this.props.data[index][1],
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

  /**
   * onMouseLeave
   */
  public onMouseEnter = (item: any, index: any) => () => {
    this.barMouseover(item, index)
  }

  /**
   * react 控制 主体渲染，d3 负责提供数据，和渲染坐标轴
   */
  public renderContent = () => {
    return (
      <>
        <g className={'barHelp'} fill={'white'}>
          {this.scaleData.map((item: [number, number], index: number) => (
            <rect
              style={{ mixBlendMode: 'multiply' }}
              key={index}
              data-value={this.props.data[index][1]}
              x={item[0]}
              y={0}
              height={this.yaxisHeight}
              width={this.xScale.bandwidth()}
              onMouseEnter={this.onMouseEnter(item, index)}
            />
          ))}
        </g>
        <g className={'barContent'} fill={'steelblue'}>
          {this.scaleData.map((item: [number, number], index: number) => {
            return (
              <rect
                style={{ mixBlendMode: 'multiply', transition: 'all 0.5s' }}
                key={index}
                data-value={this.props.data[index][1]}
                x={item[0] + this.barWidth / 4}
                y={item[1]}
                height={this.yaxisHeight - item[1]}
                width={this.barWidth}
                onMouseEnter={this.onMouseEnter(item, index)}
              />
            )
          })}
        </g>
      </>
    )
  }

  /**
   * getE
   */
  public getAttributes = (node: Element) => {
    const boj: any = {}
    map(node.attributes, (item) => {
      boj[item.name] = item.value
    })

    boj.className = boj.class

    return boj
  }

  /**
   * renderXy
   */
  public renderAxis = (select: any, props?: any) => {
    const path = select._groups[0][0].children[0]
    const ticks = select._groups[0][0].children
    return (
      <g {...this.getAttributes(select._groups[0][0])}>
        <path {...this.getAttributes(path)} />
        {map(ticks, (node: Element, index: number) => {
          if (index > 0) {
            return (
              <g key={index} {...this.getAttributes(node)}>
                <line
                  stroke={'currentColor'}
                  {...this.getAttributes(node.children[0])}
                />

                <text {...this.getAttributes(node.children[1])}>
                  {node.children[1].textContent}
                </text>
              </g>
            )
          }
          return ''
        })}
      </g>
    )
  }

  public render() {
    return (
      <div style={{ position: 'relative' }} onMouseLeave={this.onMouseLeave}>
        <svg id="d3svg" width={700} height={400}>
          <g
            className={'content'}
            transform={`translate(${this.margin.left},${this.margin.top})`}>
            {this.xScale && this.renderContent()}

            {this.xScale && this.renderAxis(this.ySelect)}

            {this.xScale &&
              this.renderAxis(this.xSelect, {
                transform: `translate(${0},${this.yaxisHeight})`,
                textAnchor: 'middle',
              })}
          </g>
        </svg>

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
