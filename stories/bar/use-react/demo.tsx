import { random, range } from 'lodash-es'
import * as React from 'react'
import { data1 } from '../../data'
import { UseReact } from './index'
export interface IDemoProps {
  className?: string

  style?: React.CSSProperties
}

export class Demo extends React.Component<IDemoProps> {
  public state: {
    data: Array<[number | string, number]>
    flag: number
  } = {
    data: range(1, 100).map((value) => [value + '', random(1, 100)]),
    flag: 0,
  }

  /**
   * onClick
   */
  public onClick = () => {
    this.setState({
      data: data1.map((item) => [item.name, random(1, 10)]),
      flag: this.state.flag + 1,
    })
  }

  public render() {
    return (
      <div>
        <UseReact data={this.state.data} flag={this.state.flag} />

        <button onClick={this.onClick}>changeData</button>
      </div>
    )
  }
}
