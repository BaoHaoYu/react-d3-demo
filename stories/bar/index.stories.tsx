import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { BaseBar } from './base'

storiesOf('bar', module)
  .addDecorator(withKnobs)
  .add('BaseBar', () => {
    return (
      <div>
        <BaseBar />
      </div>
    )
  })
