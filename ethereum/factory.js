import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// Old deployed contract 0x091f98bb50473d0629998e0Aee7848dCE230C0f0
const address = '0xc5f3d0082c235bfba9c9c7b2539490e15cbbaed0';

export default new web3.eth.Contract(CampaignFactory.abi, address);
