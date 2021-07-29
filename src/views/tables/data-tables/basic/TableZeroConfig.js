// ** Table Columns
import { data, basicColumns } from '../data'

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable, { createTheme } from 'react-data-table-component'
import { Card, CardHeader } from 'reactstrap'

const DataTablesBasic = () => {
  return (
    <div>
      <DataTable
        noHeader
        data={data}
        columns={basicColumns}
        theme="red"
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} 
        style={{backgroundColor: 'transparent' }}/>}
      />
    </div>
  )
}

export default DataTablesBasic
