import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: 'eth_requestAccounts', params: [] });
  web3 = new Web3(window.ethereum);
  console.log('BROWSER Web3 Metamask provider');
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/b3e812dcb6d3485bbced2a87ea4c11df'
  );

  web3 = new Web3(provider);
  console.log('SERVER Web3 provider');
}

export default web3;
