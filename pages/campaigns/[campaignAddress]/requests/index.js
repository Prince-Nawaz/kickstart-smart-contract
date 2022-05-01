import Link from 'next/link';
import React, { Component } from 'react';
import { Button, Grid, Table } from 'semantic-ui-react';
import Layout from '../../../../components/Layout';
import RequestRow from '../../../../components/RequestRow';
import Campaign from '../../../../ethereum/campaign';

export class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { campaignAddress } = props.query;
    const campaign = await Campaign(campaignAddress);
    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const requests = await Promise.all(
      Array(+requestsCount)
        .fill()
        .map(async (element, index) => {
          return await campaign.methods.requests(index).call();
        })
    );

    // console.log(requests, typeof +requestsCount);
    return {
      campaignAddress,
      requests,
      approversCount,
    };
  }

  renderRows() {
    const rows = this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          campaignAddress={this.props.campaignAddress}
          approversCount={this.props.approversCount}
        />
      );
    });
    return rows;
  }

  render() {
    const { Header, Row, HeaderCell, Body, Cell, Footer } = Table;
    return (
      <Layout>
        <Link href={`/campaigns/${this.props.campaignAddress}/requests/new`}>
          <a>
            <Button primary content='Add Request' floated='right'></Button>
          </a>
        </Link>
        <h3>Requests</h3>
        <Table celled>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
              <HeaderCell>Comments</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
          <Footer>
            <Row>
              <HeaderCell colspan='8'>
                Found {this.props.requests.length} Requests.
              </HeaderCell>
            </Row>
          </Footer>
        </Table>
      </Layout>
    );
  }
}

export default RequestIndex;
