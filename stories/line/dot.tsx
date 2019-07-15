import * as d3 from 'd3'
import * as React from 'react'
import { BaseLine } from './base'
import { select } from 'd3';
export interface IAreaLineProps {
  className?: string

  style?: React.CSSProperties
}

export class DotLine extends BaseLine {
  public componentDidMount() {
    super.componentDidMount()
    // 图表宽和高
    const height: number = +d3.select('#d3svg').attr('height')
    // 图表的边距
    const margin = { top: 30, right: 20, bottom: 30, left: 40 }
    const newLineCreate = d3.area()
    .curve(d3.curveLinear)

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
    
    d3.select('#d3svg .line')
    .attr('fill', 'steelblue')
    .attr('d', () => {
      return newLineCreate(this.lineData)
    })

    var group = select('#d3svg').append("g").attr("class","group");

    group.selectAll("circle.dots")
    .data(this.lineData)
    .enter()
    .append("circle")
    .attr(
        'transform',
        `translate(${margin.left},${margin.top})`,
      )
    .attr('fill','red')
    .attr('cy',(item:[number,number])=>item[1])
    .attr('cx',(item:[number,number])=>item[0])
    .attr("class","dots")
    .attr("r", 5);
  }
}
