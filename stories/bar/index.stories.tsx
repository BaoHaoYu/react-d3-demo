import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { BaseBar } from "./base";
import * as React from 'react'

storiesOf('bar', module)
  .addDecorator(withKnobs)
  .add('BaseBar',()=>{
    return (
      <div>
        <BaseBar />
      </div>
    )
  })