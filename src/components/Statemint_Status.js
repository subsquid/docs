import React, {useState,useEffect} from 'react';
import { setup_chain_api, } from './Setup.js';  
import axios from 'axios'; 

export default function Statemint_Status({children, color}) {
    const chain_url    = 'wss://statemint-rpc.dwellir.com';
    const gs_chain_url = 'https://squid.subsquid.io/gs-explorer-statemint/graphql';
    
    const query =
                    `
                    query MyQuery {
                        squidStatus {
                        height
                        }
                    }
                    `;
    const [gs_lastCheck, setGsLastCheck]     = useState(0);
    const [pc_blockNumber, setPcBlockNumber] = useState("");
    const [gs_blockNumber, setGsBlockNumber] = useState("");
    const [pc_api, setPc_api] = useState(undefined);
    const [fColor, setFColor] = useState("#fff");


    const get_GiantSquidStatus = async () => {
          axios({ url: `${gs_chain_url}`, method: 'post', data: { query, } })
          .then((result) => {
                  const giant_squid_block_number = result.data.data.squidStatus.height;
                  setGsBlockNumber(giant_squid_block_number);
                  setGsLastCheck(gs_lastCheck + 1);  
          });
    };

    useEffect(() => {
        const runSetup = async () => {
            const retieved_api  = await setup_chain_api(chain_url);
            setPc_api(retieved_api);
        }
        runSetup();

    }, []);   

    useEffect(() => {
      const parachain = async (api) => {
          const chain = await api.rpc.system.chain();
          const unsubHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
              setPcBlockNumber(`${lastHeader.number}`);
          });
      }

      if (pc_api)
      {
          parachain(pc_api).catch((er) => { console.log(`parachain ${chain_url} Error: `,er);  });
          // get_GiantSquidStatus();
      }
      else console.log(`${chain_url} => provider is undefined`);

    }, [pc_api]);  

    useEffect(() => {
          setTimeout(get_GiantSquidStatus , 12000);
    },[gs_lastCheck])

    useEffect(() => {
      if (gs_blockNumber!="" && pc_blockNumber!="")
      {
         const ratio = parseInt(100 * (Number(gs_blockNumber) / Number(pc_blockNumber)));
         if (ratio==100) setFColor("#68FF33")
         else if (ratio>=99) setFColor("#F6FF33")
         else setFColor("#FF4733");
      }
    },[gs_blockNumber,pc_blockNumber])

    return (
      <span
        style={{
          fontSize: 11,
          backgroundColor: color,
          borderRadius: '2px',
          color: `${fColor}`, //'#fff',
          padding: '0.2rem',
        }}>
        Synced {
          (gs_blockNumber!="" && pc_blockNumber!="")? `${parseInt(100 * (Number(gs_blockNumber) / Number(pc_blockNumber)))}%` : "loading"
        }
        <br/>
        <nobr>{`${gs_blockNumber==""?"loading":gs_blockNumber} / ${pc_blockNumber==""?"loading":pc_blockNumber}`}</nobr>
        <br/>
        Blocks
      </span>
    );
}