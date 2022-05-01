import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

const ContributeForm = (props) => {
  const [contribution, setContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onContributeHandler = async () => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = await Campaign(props.campaignAddress);
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, 'ether'),
      });
      setContribution('');
      router.replace(`/campaigns/${props.campaignAddress}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <Form onSubmit={onContributeHandler} error={!!errorMessage}>
      <Form.Field>
        <label>Contribute to this campaign!</label>
        <Input
          label='ether'
          labelPosition='right'
          value={contribution}
          onChange={(evt) => setContribution(evt.target.value)}
        />
      </Form.Field>
      <Message error header='Oops!' content={errorMessage} />
      <Button type='submit' primary loading={loading}>
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
