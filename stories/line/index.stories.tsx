import { radios, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { D3Demo } from './d3-demo'
storiesOf('p1', module)
  .addDecorator(withKnobs)
  .add('demo', () => {
    const curve = radios('曲线类型:d3.line().curve(???)', { curveMonotoneX: '0', curveCatmullRom: '1' }, '0')
    return (
      <div>
        <D3Demo 
          curve={curve} 
        />
      </div>
    )
  })
