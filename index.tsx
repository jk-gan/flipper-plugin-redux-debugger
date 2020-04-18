import React from 'react';
import {
  RoundedSection,
  CenteredView,
  FlipperPlugin,
  DataDescription,
  Panel,
  ManagedDataInspector,
  Text,
  brandColors,
  TableBodyRow,
  FlexColumn,
  SearchableTable,
  DetailSidebar,
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
    value: 'Action',
  },
};

const columnSizes = {
  id: '15%',
  action: 'flex',
};

type PersistedState = {
  actions: Array<any>;
};

export default class ReduxViewer extends FlipperPlugin<State, any, any> {
  state = {
    selectedId: '',
  };

  static defaultPersistedState: PersistedState = {
    actions: [],
  };

  static persistedStateReducer<PersistedState>(
    persistedState: PersistedState,
    method: string,
    payload: Row
  ) {
    console.log('method: ', method);
    console.log('payload: ', payload);
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

  renderSidebar() {
    const { selectedId } = this.state;
    if (selectedId != '') {
      const { actions } = this.props.persistedState;
      const selectedData = actions.find((v) => v.id === selectedId);
      return (
        <>
          <Panel floating={false} heading="Action Type">
            <DataDescription type="string" value={selectedData.action.type} />
          </Panel>
          <Panel floating={false} heading="Payload">
            <ManagedDataInspector
              data={selectedData.action.payload}
              expandRoot={true}
            />
          </Panel>
          <Panel floating={false} heading="State">
            <ManagedDataInspector
              diff={selectedData.before}
              data={selectedData.after}
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
    console.log('key: ', key);
    this.setState({ selectedId: key[0] });
  };

  render() {
    const { actions } = this.props.persistedState;
    const rows = actions.map((v) => this.buildRow(v));

    return (
      <FlexColumn grow={true}>
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
          /* actions={<Button onClick={this.clear}>Clear</Button>} */
        />
        <DetailSidebar>{this.renderSidebar()}</DetailSidebar>
      </FlexColumn>
    );
  }

  /* render() { */
  /*   return ( */
  /*     <CenteredView> */
  /*       <RoundedSection title="Redux Dev Tools"> */
  /*         <Text size={24}>Current action: {this.state.selectedId}</Text> */
  /*       </RoundedSection> */
  /*     </CenteredView> */
  /*   ) */
  /* } */
}
