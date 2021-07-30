/* eslint-disable */

import { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, Button } from 'reactstrap'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import DataTable, { createTheme } from 'react-data-table-component'
import { basicColumns } from './tables/data-tables/data'
import { ChevronDown } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'
import Web3 from "web3"
import abi from '../constant/abi.json'

import TableZeroConfig from './tables/data-tables/basic/TableZeroConfig'
import { data as initData } from './tables/data-tables/data'

import GoldBadge from '@src/assets/images/gold.svg'
import SilverBadge from '@src/assets/images/silver.svg'
import BronzeBadge from '@src/assets/images/bronze.svg'
import Bg from '@src/assets/images/bg.png'
import Dog from '@src/assets/images/dog.png'
import Scroll from '@src/assets/images/scroll.png'
import TopDog from '@src/assets/images/topdog.png'
import Spinner from '../@core/components/spinner/Fallback-spinner'


const Home = () => {
  const topRanks = [1]
  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io")
  );
  const contract = new web3.eth.Contract(
    abi,
    "0x29dd851E8919D0988BDD440E7cB4ac5a6aaAaef6",
    (error, result) => { if (error) console.log(error) }
  );
  const [data, setData] = useState(initData);
  const [topDogTotalRewards, setTopDogTotalRewards] = useState(0);
  const [internalTxs, setInternalTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    console.log(contract)
    const initialize = async () => {
      const data = [];

      const name = await contract.methods.name().call();
      console.log(name)

      for (let index = 0; index < 10; index++) {
        const { addr, balance } = await contract.methods.top10Dogs(index).call();
        console.log(addr, balance)
        data.push({
          id: index + 1,
          avatar: 'user.png',
          full_name: addr,
          amount: balance
        });
      }

      await getTopDogTotalRewards(data[0].full_name);
      setData(data);
      setLoading(false);
    }

    initialize();

    const interval = setInterval(async () => {
      await initialize();
    }, 1000 * 3600 * 4);

    return () => {
      clearInterval(interval);
    }
  }, [])

  const getTopDogTotalRewards = async (topDog) => {
    const cache = new InMemoryCache();
    const client = new ApolloClient({
      // Provide required constructor fields
      cache: cache,
      uri: 'https://graphql.bitquery.io',

      // Provide some optional constructor fields
      name: 'react-web-client',
      version: '1.3',
      queryDeduplication: false,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
    });

    await client.query({
      query: gql`
        query GetTopDogTotalRewards 
        {
            ethereum(network: bsc) {
              transfers(options: {desc: "block.timestamp.time"}, date: {since: null, till: null}, amount: {gt: 0}, receiver: {is: "${topDog}"}, currency: {is: "0x29dd851E8919D0988BDD440E7cB4ac5a6aaAaef6"}) {
                  block {
                    timestamp {
                      time(format: "%Y-%m-%d %H:%M:%S")
                    }
                  }
                  currency {
                    address
                    symbol
                  }
                  amount
                  amountInUSD: amount (in:USD)
                  transaction {
                    hash
                  }
                  external
                }
            }
        }
      `
    })
      .then(result => {
        let totalRewards = 0;
        const internalTxs = result.data.ethereum.transfers.map(tx => {
          const time = tx.block.timestamp.time;

          totalRewards += tx.amount;

          return {
            date: `${time}`,
            amount: tx.amount
          }
        });

        setInternalTxs(internalTxs)
        setTopDogTotalRewards(totalRewards);
      });
  }

  const renderProfile = (row) => {
    const txColumns = [
      {
        name: 'Time',
        selector: 'date',
        sortable: true,
        maxWidth: '250px'
      },
      {
        name: 'Amount',
        selector: 'amount',
        sortable: true,
        maxWidth: '250px'
      },
    ]

    return (<div className={"kt0"}>
      <div className="row">
        <div className="col-sm-4 pt-2">
          <p style={{ maxWidth: '100%', wordWrap: 'break-word' }}>{row.full_name}</p>
          <p style={{ maxWidth: '100%', wordWrap: 'break-word' }}>TOKENS BOUGHT: {row.amount}</p>
          <p style={{ maxWidth: '100%', wordWrap: 'break-word' }}>TOTAL REWARDS: {topDogTotalRewards}</p>
          <a target="_blank" href={`https://bscscan.com/address/${row.full_name}#tokentxns`}>
            <Button>Visit</Button>
          </a>
        </div>
        <div className="col-sm-8">
          <div style={{ maxWidth: '500px' }}>
            <DataTable
              noHeader
              pagination
              paginationPerPage={5}
              paginationComponentOptions={{ noRowsPerPage: true }}
              data={internalTxs}
              columns={txColumns}
              theme="red"
              className='react-dataTable'
              sortIcon={<ChevronDown size={10}
                style={{ backgroundColor: 'transparent' }} />}
            />
          </div>
        </div>
      </div>
    </div>)
  }

  const getTopRankData = rank => {
    const badgeText = ["GOLD", "SILVER", "BRONZE"]
    let badgeIcon = BronzeBadge

    switch (rank) {
      case 1:
        badgeIcon = GoldBadge
        break
      case 2:
        badgeIcon = SilverBadge
        break
    }

    return {
      badgeText: badgeText[rank],
      badgeIcon
    }
  }
  const [isVisible, setIsVisible] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 1300,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      <div className="main" style={{ backgroundImage: `url(${Bg})` }}>
        <div className="main-header"></div>
        <img src={Dog} alt="" className="dogImg" />
        <p className="c-h3 c-white header-title">KING OF THE<br /><span className="c-h1">DOGE</span></p>
        <img src={Scroll} alt="" className="scroll" onClick={scrollToTop} />
        <div className="main-content">
          <div>
            <img src={TopDog} alt="" className="topdog-image" />
            <span className="c-h2 c-white stats" style={{ position: 'relative', left: -32 }}>TOP DOG</span>
          </div>
          {loading ? (<Spinner />) : (<>
            {topRanks.map(rank => {
              const res = getTopRankData(rank - 1)
              console.log(rank);
              return (<Col sm='12' key={rank} className="items">
                {renderProfile(data[rank - 1])}
              </Col>)
            })}
          </>)}
          <div className="rankings">
            <div className="rankings-header">
              <p className="c-h2 c-blue">TOP 10 DOGS</p>
            </div>
            <div>
              <DataTable
                noHeader
                data={data}
                columns={basicColumns}
                theme="red"
                className='react-dataTable'
                sortIcon={<ChevronDown size={10}
                  style={{ backgroundColor: 'transparent' }} />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
