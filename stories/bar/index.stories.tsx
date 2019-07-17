import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { BaseBar } from './_base'
import { Demo } from './use-react/demo'

storiesOf('bar', module)
  .addDecorator(withKnobs)
  .add('BaseBar', () => {
    return (
      <div>
        <BaseBar />
      </div>
    )
  })
  .add('UseReact', () => {
    return (
      <div>
        <Demo />
      </div>
    )
  })
