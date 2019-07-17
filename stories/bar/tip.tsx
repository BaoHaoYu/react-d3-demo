import $ from 'jquery'
import * as React from 'react'
import * as dom from 'react-dom'
// @ts-ignore
import s from './tip.scss'
export interface ITipProps {
  hidden?: boolean

  className?: string

  style?: React.CSSProperties

  barWidth?: number

  index?: number
}

export class Tip extends React.Component<ITipProps> {
  public static defaultProps: Partial<ITipProps> = {
    barWidth: 0,
  }

  public state = {
    ml: 0,
  }

  public componentDidUpdate(prevProps: ITipProps) {
    if (prevProps.index !== this.props.index) {
      const d = $(dom.findDOMNode(this) as Element)
      this.setState({ ml: d.outerWidth()! / 2 - this.props.barWidth! / 2 })
    }
  }

  public render() {
    return (
      <div
        className={s.tip}
        {...this.props}
        style={{ ...this.props.style, marginLeft: -this.state.ml }}>
        {this.props.children}
      </div>
    )
  }
}
