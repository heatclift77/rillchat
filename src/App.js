import React, { useState, useEffect } from 'react'
import Routers from './routers'
import {Provider} from 'react-redux'
import store from './configs/redux/index'
export default function App() {
  return (
    <div>
      <Provider store={store}>
        <Routers />
      </Provider>
    </div>
  )
}
