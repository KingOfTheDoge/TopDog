/* eslint-disable */

import { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, Button } from 'reactstrap'
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
  const topRanks = [1, 2, 3]
  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io")
  );
  const contract = new web3.eth.Contract(
    abi,
    "0x29dd851E8919D0988BDD440E7cB4ac5a6aaAaef6",
    (error, result) => { if (error) console.log(error) }
  );
  const [data, setData] = useState(initData);
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
  let kt = 0;
  const renderProfile = (row) => {
    kt++;
    return (<div class={"kt" + kt}>
      <p style={{ maxWidth: '100%', wordWrap: 'break-word' }}>{row.full_name}</p>
      <a target="_blank" href={`https://bscscan.com/address/${row.full_name}`}>
        <Button>Visit</Button>
      </a>
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
      <div class="main" style={{ backgroundImage: `url(${Bg})` }}>
        <div class="main-header"></div>
        <img src={Dog} alt="" class="dogImg" />
        <p class="c-h3 c-white header-title">KING OF THE<br /><span class="c-h1">DOGE</span></p>
        <img src={Scroll} alt="" class="scroll" onClick={scrollToTop} />
        <div class="main-content">
          <div>
            <img src={TopDog} alt="" class="topdog-image" />
            <span class="c-h2 c-white stats" style={{ position: 'relative', left: -32 }}>TOP DOG</span>
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
          <div class="rankings">
            <div class="rankings-header">
              <p class="c-h2 c-blue">TOP 10 DOGS</p>
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
