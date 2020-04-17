import React from 'react';
import {
  RoundedSection,
  CenteredView,
  FlipperPlugin,
  Panel,
  ManagedDataInspector,
  Text,
  brandColors,
  TableBodyRow,
  FlexColumn,
  SearchableTable,
  DetailSidebar
} from 'flipper';

type State = {
  selectedId: string; };

type Row = {
  type: string;
  payload: object;
}

const columns = {
  action: {
    value: "Action"
  }
}

const columnSizes = {
  action: 'flex',
};

type PersistedState = {
  actions: Array<any>,
};

export default class ReduxViewer extends FlipperPlugin<State, any, any> {
  state = {
    selectedId: ''
  };

  dummyData = [
    {
      id: "1",
      action: "fetchStocksSuccess",
      payload: {
        item: "AAA"
      }
    },
    {
      id: "2",
      action: "fetchOutletsSuccess",
      payload: {
        item: "BBB"
      }
    },
  ]

  static defaultPersistedState: PersistedState = {
    actions: [],
  };

  static persistedStateReducer<PersistedState>(
    persistedState: PersistedState,
    method: string,
    payload: Row,
  ) {
    console.log('method: ', method);
    console.log('payload: ', payload);
    switch (method) {
      case 'actionDispatched':
        return {
          ...persistedState,
          actions: [
            ...persistedState.actions,
            payload
          ]
        }
      default:
        return persistedState;
    }
  };

  renderSidebar() {
    const { selectedId } = this.state;
    if (selectedId != '') {
      const { actions } = this.props.persistedState;
      const selectedData = actions.find(v => v.type === selectedId);
      console.log('selectedData: ', selectedData);
      console.log('selectedId: ', selectedId);
      return (
        <Panel floating={false} heading={'Payload'}>
          <ManagedDataInspector data={selectedData} expandRoot={true} />
        </Panel>
      )
    }

    return null;
  }

  buildRow(row: Row): TableBodyRow {
    return {
      columns: {
        action: {
          value: <Text>{row.type}</Text>,
          filterValue: row.type,
        },
        payload: {
          value: <Text>{JSON.stringify(row.payload)}</Text>,
          filterValue: JSON.stringify(row.payload),
        },
      },
      key: row.type,
      copyText: JSON.stringify(row),
      filterValue: `${row.type}`,
    };
  }

  onRowHighlighted = (key) => {
    console.log("key: ", key);
    this.setState({ selectedId: key[0] });
  };

  render() {
    const { actions } = this.props.persistedState;
    console.log('actions: ', actions);
    const rows = actions.map(v => this.buildRow(v));

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

