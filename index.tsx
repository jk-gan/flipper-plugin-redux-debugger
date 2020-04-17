import React from 'react';
import {
  FlipperPlugin,
  RoundedSection,
  Button,
  produce,
  CenteredView,
  Info,
  colors,
  styled,
  FlexRow,
  Text,
  brandColors,
} from 'flipper';

type State = {
  action: string;
};

function initialState(): State {
  return {
    action: 'initialize',
  };
}

export default class ReduxDevTools extends FlipperPlugin<State, any, any> {
  state = initialState();

  componentDidMount() {
    this.client.subscribe('newAction', (action) => {
      this.setNewState(action);
    });
  }

  setNewState(action) {
    this.setState({ action: action.type });
  }

  render() {
    return (
      <CenteredView>
        <RoundedSection title="Redux Dev Tools">
          <Text size={24}>Current action: {this.state.action}</Text>
        </RoundedSection>
      </CenteredView>
    );
  }
}
