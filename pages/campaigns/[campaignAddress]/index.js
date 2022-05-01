import Link from 'next/link';
import { withRouter } from 'next/router';
import React, { Component } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import ContributeForm from '../../../components/ContributeForm';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
export class CampaignShow extends Component {
  static async getInitialProps(props) {
    // console.log('Server side next props', props.query.campaignAddress);
    const campaign = await Campaign(props.query.campaignAddress);
    const summary = await campaign.methods.getSummary().call();
    return {
      campaignAddress: props.query.campaignAddress,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager,
    } = this.props;
    const items = [
      {
        header: manager,
        description: 'Address of Manager',
        meta: 'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        description:
          'You must contribute atleast this much wei to become a approver',
        meta: 'Minimum Contribution (wei)',
      },
      {
        header: requestsCount,
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers.',
        meta: 'No. of requests',
      },
      {
        header: approversCount,
        description:
          'Number of people who have already donated to the campaign.',
        meta: 'No. of approvers',
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        description: 'Campaign Balance (ether)',
        meta: 'The balance is how much money the campaign has left to spend.',
      },
    ];
    return <Card.Group items={items} />;
  }
  render() {
    const { campaignAddress } = this.props.router.query;
    return (
      <Layout>
        <h3>Campaign Details : {campaignAddress}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm campaignAddress={this.props.campaignAddress} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link href={`/campaigns/${this.props.campaignAddress}/requests`}>
                <a>
                  <Button content='View Requests' primary />
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default withRouter(CampaignShow);
