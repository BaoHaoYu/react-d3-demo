import { number, radios, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { D3Demo } from './d3-demo'
storiesOf('p1', module)
  .addDecorator(withKnobs)
  .add('demo', () => {
    const paddingInner = number('scaleBand() - paddingInner()', 0, {
      range: true,
      max: 10,
      min: -10,
      step: 1,
    })
    const paddingOuter = number('scaleBand() - paddingOuter()', 0, {
      range: true,
      max: 10,
      min: -10,
      step: 0.5,
    })
    const curve = radios(
      '曲线类型:line() - curve()',
      { curveMonotoneX: '0', curveCatmullRom: '1' },
      '0',
    )
    return (
      <div>
        <D3Demo
          curve={curve}
          paddingInner={paddingInner}
          paddingOuter={paddingOuter}
        />
      </div>
    )
  })
