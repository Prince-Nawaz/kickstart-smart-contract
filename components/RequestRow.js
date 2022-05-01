import Router from 'next/router';
import React, { Component } from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const APPROVE = 'APPROVE';
const FINALIZE = 'FINALIZE';

export class RequestRow extends Component {
  state = {
    isLoading: false,
    userAction: '',
    errorMessage: '',
    errorRowIndex: null,
  };
  onApproveHandler = async () => {
    this.setState({
      isLoading: true,
      userAction: APPROVE,
      errorMessage: '',
      errorRowIndex: null,
    });
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await Campaign(this.props.campaignAddress);
      await campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
        errorRowIndex: this.props.id,
        userAction: '',
      });
    }
    this.setState({ isLoading: false, userAction: '' });
    Router.push(`/campaigns/${this.props.campaignAddress}/requests`);
  };

  onFinalizeHandler = async () => {
    this.setState({
      isLoading: true,
      userAction: FINALIZE,
      errorMessage: '',
      errorRowIndex: null,
    });
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await Campaign(this.props.campaignAddress);
      await campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0],
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
        errorRowIndex: this.props.id,
        userAction: '',
      });
    }
    this.setState({ isLoading: false, userAction: '' });
    Router.push(`/campaigns/${this.props.campaignAddress}/requests`);
  };

  render() {
    const { Header, Row, HeaderCell, Body, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;
    return (
      <Row
        error={this.state.errorRowIndex === id}
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{`${request.approvalCount} / ${approversCount}`}</Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              content='Approve'
              color='green'
              basic
              onClick={this.onApproveHandler}
              loading={
                this.state.isLoading && this.state.userAction === APPROVE
              }
            />
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              content='Finalize'
              basic
              color='blue'
              onClick={this.onFinalizeHandler}
              loading={
                this.state.isLoading && this.state.userAction === FINALIZE
              }
              disabled={!readyToFinalize}
            />
          )}
        </Cell>
        <Cell>
          {this.state.errorMessage && (
            <div style={{ wordBreak: 'break-word' }}>
              <Icon name='warning sign' />
              {this.state.errorMessage}
            </div>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
