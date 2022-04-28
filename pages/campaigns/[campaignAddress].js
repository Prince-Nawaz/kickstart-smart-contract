import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';

const CampaignShow = (props) => {
  const router = useRouter();
  const { campaignAddress } = router.query;
  //   console.log(router);
  console.log(props);
  return (
    <Layout>
      <h3>Campaign Details</h3>
      <div>Campaign Address: {campaignAddress}</div>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (props) => {
  //   console.log('Server side next props', props.query.campaignAddress);
  const campaign = await Campaign(props.query.campaignAddress);
  const summary = await campaign.methods.getSummary().call();
  return {
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  };
};

export default CampaignShow;
