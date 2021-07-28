/* eslint-disable */

import { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, Button } from 'reactstrap'

// ** Custom Components
import Avatar from '@components/avatar'
import Web3 from "web3"
import abi from '../constant/abi.json'

import TableZeroConfig from './tables/data-tables/basic/TableZeroConfig'
import { data as initData } from './tables/data-tables/data'

import GoldBadge from '@src/assets/images/gold.svg'
import SilverBadge from '@src/assets/images/silver.svg'
import BronzeBadge from '@src/assets/images/bronze.svg'
import Spinner from '../@core/components/spinner/Fallback-spinner'

const Home = () => {
  const topRanks = [1, 2, 3]
  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://red-dry-sky.bsc.quiknode.pro/448fa0f4002c4f02ba95c5a1f77c1c2bfa343bd5/")
  );
  const contract = new web3.eth.Contract(
    abi,
    "0x7Bf09149F2F3a7d2306955294949FCc59211fd9a",
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

  const renderProfile = (row) => {
    return (<div className='text-center'>
      {row.avatar === '' ? (
        <Avatar color={`light-${states[row.status]}`} content={row.full_name} initials />
      ) : (
        <Avatar img={require(`@src/assets/images/avatars/${row.avatar}`).default} imgWidth="84" imgHeight="84" />
      )}
      <div className='user-info text-truncate mt-1'>
        <a target="_blank" href={`https://bscscan.com/address/${row.full_name}`}>
          <Button>Visit</Button>
        </a>
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

  return (
    <div>
      {loading ? (<Spinner />) : (<><Row>
        {topRanks.map(rank => {
          const res = getTopRankData(rank - 1)

          return (<Col sm='4' key={rank}>
            <Card>
              <CardBody>
                <p className="text-center">
                  <img width="20" src={res.badgeIcon} />
                  <span>{res.badgeText}</span>
                </p>
                {renderProfile(data[rank - 1])}
              </CardBody>
            </Card>
          </Col>)
        })}
      </Row>

        <Row>
          <Col sm='12'>
            <TableZeroConfig />
          </Col>
        </Row></>)}
    </div>
  )
}

export default Home
