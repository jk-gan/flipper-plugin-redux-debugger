import React from 'react';
import {
  FlipperPlugin,
  Panel,
  ManagedDataInspector,
  Text,
  TableBodyRow,
  FlexColumn,
  SearchableTable,
  DetailSidebar,
  Button,
  MultiLineInput,
  FlexRow,
  Label,
  Select,
  Input,
  ErrorBlock,
} from 'flipper';

type State = {
  selectedId: string;
};

type Row = {
  id: string;
  action: {
    type: string;
    payload: any;
  };
  before: object;
  after: object;
};

const columns = {
  id: {
    value: 'ID',
  },
  action: {
    value: 'Action Type',
  },
};

const columnSizes = {
  id: '20%',
  action: 'flex',
};

const commonMargin = {
  margin: '0.5em 1em 0.5em 1em',
};

const textBox = {
  flex: 1,
  height: '100px',
  ...commonMargin,
};

type PersistedState = {
  actions: Array<any>;
};

export default class ReduxViewer extends FlipperPlugin<State, any, any> {
  state = {
    selectedId: '',
    invokeActionName: '',
    invokeActionPayloadString: '',
    error: '',
  };

  static defaultPersistedState: PersistedState = {
    actions: [],
  };

  static persistedStateReducer<PersistedState>(
    persistedState: PersistedState,
    method: string,
    payload: Row
  ) {
    switch (method) {
      case 'actionDispatched':
        return {
          ...persistedState,
          actions: [...persistedState.actions, payload],
        };
      default:
        return persistedState;
    }
  }

  constructor(props) {
    super(props);
    this.handleDispatch = this.handleDispatch.bind(this);
  }

  renderSidebar() {
    const { selectedId } = this.state;
    if (selectedId != '') {
      const { actions } = this.props.persistedState;
      const selectedData = actions.find((v) => v.id === selectedId);
      return (
        <>
          <Panel floating={false} heading="Action">
            <ManagedDataInspector
              data={selectedData.action}
              collapsed={true}
              expandRoot={true}
            />
          </Panel>
          <Panel floating={false} heading="Diff">
            <ManagedDataInspector
              diff={selectedData.before}
              data={selectedData.after}
              collapsed={true}
              expandRoot={false}
            />
          </Panel>
        </>
      );
    }

    return null;
  }

  buildRow(row: Row): TableBodyRow {
    return {
      columns: {
        id: {
          value: <Text>{row.id}</Text>,
          filterValue: row.id,
        },
        action: {
          value: <Text>{row.action.type}</Text>,
          filterValue: row.type,
        },
      },
      key: row.id,
      copyText: JSON.stringify(row),
      filterValue: `${row.id}`,
    };
  }

  onRowHighlighted = (key) => {
    this.setState({ selectedId: key[0] });
  };

  clear = () => {
    this.setState({ selectedId: '' });
    this.props.setPersistedState({ actions: [] });
  };

  handleDispatch = (event) => {
    this.setState({ error: null });
    try {
      const { invokeActionName, invokeActionPayloadString } = this.state;

      const actionPayload =
        invokeActionPayloadString.trim() == ''
          ? []
          : JSON.parse(invokeActionPayloadString);

      this.client.call('dispatchAction', {
        type: invokeActionName,
        payload: actionPayload,
      });
    } catch (ex) {
      if (ex instanceof SyntaxError) {
        // json format wrong
        console.group('WrongJsonFormat');
        console.error(ex);
        console.groupEnd();
      } else {
        console.group('DispatchError');
        console.error(ex);
        console.groupEnd();
      }

      this.setState({ error: ex });
    }
  };

  render() {
    const { error } = this.state;
    const { actions } = this.props.persistedState;
    const rows = actions.map((v) => this.buildRow(v));

    return (
      <FlexColumn grow={true}>
        <FlexRow>
          <Input
            placeholder={'Type your action here'}
            style={commonMargin}
            onChange={(event) => {
              this.setState({ invokeActionName: event.target.value });
            }}
          />
        </FlexRow>
        <FlexRow>
          <MultiLineInput
            placeholder={'Type your payload json here'}
            style={textBox}
            onChange={(event) => {
              this.setState({
                invokeActionPayloadString: event.target.value,
              });
            }}
          />
        </FlexRow>
        <FlexRow>
          <Button onClick={this.handleDispatch} style={commonMargin}>
            Dispatch
          </Button>
        </FlexRow>
        {error && <ErrorBlock error={error}></ErrorBlock>}
        <SearchableTable
          key={100}
          rowLineHeight={28}
          floating={false}
          multiline={true}
          columnSizes={columnSizes}
          columns={columns}
          onRowHighlighted={this.onRowHighlighted}
          multiHighlight={false}
          rows={rows}
          stickyBottom={true}
          actions={<Button onClick={this.clear}>Clear</Button>}
        />
        <DetailSidebar>{this.renderSidebar()}</DetailSidebar>
      </FlexColumn>
    );
  }
}
