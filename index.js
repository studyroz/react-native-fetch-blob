// Copyright 2016 wkh237@github. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be
// found in the LICENSE file.

import {
  NativeModules,
  DeviceEventEmitter,
  Platform,
  AppState,
} from 'react-native'
import type {
  RNFetchBlobNative,
  RNFetchBlobConfig,
  RNFetchBlobStream,
  RNFetchBlobResponseInfo
} from './types'
import URIUtil from './utils/uri'
//import StatefulPromise from './class/StatefulPromise.js'
import fs from './fs'
import getUUID from './utils/uuid'
import base64 from 'base-64'
import polyfill from './polyfill'
import _ from 'lodash'
import android from './android'
import ios from './ios'
import JSONStream from './json-stream'
import { config, fetch, wrap } from './FetchBlob'
const {
  RNFetchBlobSession,
  readStream,
  createFile,
  unlink,
  exists,
  mkdir,
  session,
  writeStream,
  readFile,
  ls,
  isDir,
  mv,
  cp
} = fs

const emitter = DeviceEventEmitter
const RNFetchBlob = NativeModules.RNFetchBlob

// when app resumes, check if there's any expired network task and trigger
// their .expire event
if(Platform.OS === 'ios') {
  AppState.addEventListener('change', (e) => {
    if(e === 'active')
      RNFetchBlob.emitExpiredEvent(()=>{})
  })
}

// register message channel event handler.
emitter.addListener("RNFetchBlobMessage", (e) => {

  if(e.event === 'warn') {
    console.warn(e.detail)
  }
  else if (e.event === 'error') {
    throw e.detail
  }
  else {
    console.log("RNFetchBlob native message", e.detail)
  }
})

// Show warning if native module not detected
if(!RNFetchBlob || !RNFetchBlob.fetchBlobForm || !RNFetchBlob.fetchBlob) {
  console.warn(
    'react-native-fetch-blob could not find valid native module.',
    'please make sure you have linked native modules using `rnpm link`,',
    'and restart RN packager or manually compile IOS/Android project.'
  )
}

export default {
  fetch,
  base64,
  android,
  ios,
  config,
  session,
  fs,
  wrap,
  polyfill,
  JSONStream
}
