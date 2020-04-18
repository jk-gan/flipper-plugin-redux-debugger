# Redux Viewer Plugin for Flipper
`flipper-plugin-redux-viewer` allows you read React Native redux logs inside [Flipper](https://fbflipper.com/) now:
- Action
- State comparison

## Get Started
1. Install [redux-flipper](https://github.com/jk-gan/redux-flipper) middleware in your React Native app:
```bash
yarn add redux-flipper react-native-flipper
# for iOS
cd ios && pod install
```

2. Add the middleware into your redux store:
```javascript
import { createStore, applyMiddleware } from 'redux';
import { logger } from 'redux-flipper';

let store = createStore(RootReducer, {}, applyMiddleware(logger));
```

3. Register plugin in your app:
```javascript
# Add this line in your root component
import react, { useEffect } from 'react';
import { registerPlugin } from 'redux-flipper';

useEffect(() => {
  registerPlugin();
}, [])
```

4. Install `flipper-plugin-redux-viewer` in Flipper desktop client

5. Start your app, then you should be able to see Redux Viewer on your Flipper app

## Acknowledgement
This plugin is inspired by [flipper-plugin-reduxinspector](https://github.com/blankapp/flipper-plugin-reduxinspector) which only work for Flutter. 
