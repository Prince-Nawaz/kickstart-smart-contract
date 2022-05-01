import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

// Version 1: 0x091f98bb50473d0629998e0Aee7848dCE230C0f0
// Version 2: 0xc5f3d0082c235bfba9c9c7b2539490e15cbbaed0
// latest: 0x08f8752322a517fAe94dBa5Eb4253F870337882f
const address = '0x08f8752322a517fAe94dBa5Eb4253F870337882f';

export default new web3.eth.Contract(CampaignFactory.abi, address);
