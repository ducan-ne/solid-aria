import { Component } from 'solid-js'
import {
  ReactToSolidBridge,
  ReactToSolidBridgeProvider,
} from 'react-solid-bridge'
import SolidToReactBridgeProvider from './bridge/solid/SolidToReactBridgeProvider'
import convertToSolidComponent from './bridge/solid/convertToSolidComponent'
import { ReactComponent } from '../react/ReactComponent'

const AsComponent = convertToSolidComponent(ReactComponent)

export const Test: Component = () => {
  return (
    <SolidToReactBridgeProvider>
      <AsComponent/>
    </SolidToReactBridgeProvider>
  )
}