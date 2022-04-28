import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Button, Card } from 'semantic-ui-react';

import Layout from '../components/Layout';
import Link from 'next/link';

export class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return {
      campaigns,
    };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => ({
      header: address,
      description: <Link href={`campaigns/${address}`}>View Campaign</Link>,
      fluid: true,
    }));

    return <Card.Group items={items}></Card.Group>;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <Link href={`campaigns/new`}>
          <Button
            floated='right'
            content='Create Campaign'
            icon='add circle'
            primary
          />
        </Link>
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default CampaignIndex;
