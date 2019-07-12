import * as React from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { axisLeft, axisBottom } from "d3-axis";
import { select } from "d3";
// https://bl.ocks.org/mbostock/431a331294d2b5ddd33f947cf4c81319
export class D3Demo extends React.Component<any> {
  componentDidMount() {
    // 数据
    const data: number[] = [954, 2680, 2055, 1701];
    const time: string[] = ["2001", "2002", "2003", "2004"];
    // 图表宽和高
    const height: number = parseInt(select("#d3svg").attr("height"));
    const width: number = parseInt(select("#d3svg").attr("width"));
    // 图表的边距
    const margin = { top: 30, right: 20, bottom: 30, left: 40 };
    // scaleLinear为线性比例，根据一个具体的数值计算，计算该数值，常用于y轴
    // 在range中的位置
    const yScale = scaleLinear()
      .domain([0, max(data) as number])
      .range([height - margin.top - margin.bottom, margin.left]);

    // scaleBand为序数比例尺，根据数组的长度，计算每个数组元素在range中的位置，长用于x轴
    const xScale = scaleBand()
      .domain(time)
      .range([0, width - margin.right - margin.left]);

    const aleft = axisLeft(yScale).ticks(5);
    const abottom = axisBottom(xScale);

    // 使用transform属性改变位置
    select("#d3svg")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(aleft);

    select("#d3svg")
      .append("g")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (height - margin.bottom) + ")"
      )
      .call(abottom);
    console.log(yScale(1000), yScale(1001), yScale(1010), yScale(1100));
  }
  render() {
    return (
      <svg
        style={{ marginLeft: 20 }}
        className="ddd"
        id="d3svg"
        width={400}
        height={300}
      />
    );
  }
}
