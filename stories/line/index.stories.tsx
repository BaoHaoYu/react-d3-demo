import { number, radios, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { AreaLine } from './_area'
import { BaseLine } from './_base'
import { DotLine } from './_dot'

storiesOf('line', module)
  .addDecorator(withKnobs)
  .add('BaseLine', () => {
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
        <BaseLine
          curve={curve}
          paddingInner={paddingInner}
          paddingOuter={paddingOuter}
        />
      </div>
    )
  })
  .add('AreaLine', () => {
    return (
      <div>
        <AreaLine />
      </div>
    )
  })
  .add('DotLine', () => {
    return (
      <div>
        <DotLine />
      </div>
    )
  })
