import Link from 'next/link';
import Router from 'next/router';
import React, { Component } from 'react';
import { Button, Form, Grid, Input, Message } from 'semantic-ui-react';
import Layout from '../../../../components/Layout';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

export class RequestNew extends Component {
  static async getInitialProps(props) {
    return {
      campaignAddress: props.query.campaignAddress,
    };
  }
  state = {
    isLoading: false,
    errorMessage: '',
    description: '',
    value: '',
    recipient: '',
  };

  onCreateHandler = async (event) => {
    event.preventDefault();
    this.setState({
      errorMessage: '',
      isLoading: true,
    });
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await Campaign(this.props.campaignAddress);
      await campaign.methods
        .createRequest(
          this.state.description,
          web3.utils.toWei(this.state.value, 'ether'),
          this.state.recipient
        )
        .send({
          from: accounts[0],
        });
      this.setState({
        errorMessage: '',
        description: '',
        value: '',
        recipient: '',
      });

      Router.push(`/campaigns/${this.props.campaignAddress}/requests`);
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
    this.setState({ isLoading: false });
  };
  render() {
    return (
      <Layout>
        <h3>Create a new request</h3>
        <Grid>
          <Grid.Column width={8}>
            <Form
              onSubmit={this.onCreateHandler}
              error={!!this.state.errorMessage}
            >
              <Form.Field>
                <label>Description</label>
                <Input
                  value={this.state.description}
                  onChange={(event) =>
                    this.setState({ description: event.target.value })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Amount in Ether</label>
                <Input
                  label='ether'
                  labelPosition='right'
                  value={this.state.value}
                  onChange={(event) =>
                    this.setState({ value: event.target.value })
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>Recipient</label>
                <Input
                  label='address'
                  labelPosition='right'
                  value={this.state.recipient}
                  onChange={(event) =>
                    this.setState({ recipient: event.target.value })
                  }
                />
              </Form.Field>
              <Message error header='Oops!' content={this.state.errorMessage} />
              <Button type='submit' primary loading={this.state.isLoading}>
                Create
              </Button>
              <Link href={`/campaigns/${this.props.campaignAddress}/requests`}>
                <a>
                  <Button content='Cancel'></Button>
                </a>
              </Link>
            </Form>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default RequestNew;
