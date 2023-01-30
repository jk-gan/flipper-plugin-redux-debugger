# Redux Debugger Plugin for Flipper

## What does this fork change compared to the original one?
* Add filter to the sidebar to allow filtering by state keys. This makes life a lot easier, especially with bigger apps / lots of states
* Change "Add" color to green to make more visible which data has been added (green) and which data has been removed (red)

![30-18-nsbae-ec3om](https://user-images.githubusercontent.com/12933672/215464164-76e42927-9dbf-4e4b-9566-1be4688bd307.gif)
![redux-debugger-change-arrows](https://user-images.githubusercontent.com/12933672/215464566-d927be99-92e2-477f-911b-fbde6a05dfd4.png)



## Original README ⤵️

![screenshot of the plugin](https://i.imgur.com/blqn8oT.png)

`flipper-plugin-redux-debugger` allows you read React Native redux logs inside [Flipper](https://fbflipper.com/) now:

- Action
- State comparison

## Get Started

1. Install [redux-flipper](https://github.com/jk-gan/redux-flipper) middleware and `react-native-flipper` in your React Native app:

```bash
yarn add redux-flipper react-native-flipper
# for iOS
cd ios && pod install
```

2. Add the middleware into your redux store:

```javascript
import { createStore, applyMiddleware } from "redux";

const middlewares = [
  /* other middlewares */
];

if (__DEV__) {
  const createDebugger = require("redux-flipper").default;
  middlewares.push(createDebugger());
}

const store = createStore(RootReducer, applyMiddleware(...middlewares));
```

3. Install [flipper-plugin-redux-debugger](https://github.com/jk-gan/flipper-plugin-redux-debugger) in Flipper desktop client:

```
Manage Plugins > Install Plugins > search "redux-debugger" > Install
```

4. Start your app, then you should be able to see Redux Debugger on your Flipper app

## Acknowledgement

This plugin is inspired by [flipper-plugin-reduxinspector](https://github.com/blankapp/flipper-plugin-reduxinspector) which only for Flutter.
