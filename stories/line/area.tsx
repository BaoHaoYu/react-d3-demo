import { area, curveMonotoneX, select } from 'd3'
import * as React from 'react'
import { BaseLine } from './base'
export interface IAreaLineProps {
  className?: string

  style?: React.CSSProperties
}

export class AreaLine extends BaseLine {
  public componentDidMount() {
    super.componentDidMount()
    // 图表宽和高
    const height: number = +select('#d3svg').attr('height')
    // 图表的边距
    const margin = { top: 30, right: 20, bottom: 30, left: 40 }
    const newLineCreate = area()
      .x((d) => {
        return d[0]
      })
      // 曲线y0 和曲线y1形成的区域就是面积了
      .y0((d) => {
        return d[1]
      })
      // 决定是否是面积图
      .y1((d) => {
        return height - margin.top - margin.bottom
      })
      .curve(curveMonotoneX)
    select('#d3svg .line')
      .attr('fill', 'steelblue')
      .attr('d', () => {
        return newLineCreate(this.lineData)
      })
  }
}
