import { ApiPromise, WsProvider } from '@polkadot/api';

const setup_chain_api = async (wsURL) => {
    const wsProvider = new WsProvider(wsURL);
    const api = await ApiPromise.create({ provider: wsProvider });
    await api.isReady;
    return api;
  };

  export {
    setup_chain_api,
  }