// ** Table Columns
import { data, basicColumns } from '../data'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader } from 'reactstrap'

const DataTablesBasic = () => {
  return (
    <Card>
      <CardHeader className="d-block">
        <h4>TOP 10 BUYERS</h4>
        <h1 style={{fontSize: "3.25rem", lineHeight: "3.5625rem"}}>Ponzu</h1>
      </CardHeader>
      <DataTable
        noHeader
        data={data}
        columns={basicColumns}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
      />
    </Card>
  )
}

export default DataTablesBasic
