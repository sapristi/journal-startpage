import { SvgIcon } from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

import {IconColumnInsertRight, IconRowInsertBottom, IconTable} from '@tabler/icons-react';

import {ReactComponent as IconTableAddSvg} from './table-add.svg'

const IconTableAdd = (props) => (
  <SvgIcon {...props} strokeWidth={2}>
      {/* <path */}
      {/*   d="M 11.5,20 H 6 C 4.8954305,20 4,19.104569 4,18 V 6 C 4,4.8954305 4.8954305,4 6,4 h 12 c 1.104569,0 2,0.8954305 2,2 v 7.5 M 4,10 H 20 M 10,4 v 16 m 4,-1 h 7 M 17.5,16 V 19.371014 22" */}
      {/*   /> */}
    <IconTableAddSvg/>
    </SvgIcon>
  
)

export {AddBoxIcon, DeleteIcon, SaveIcon, AddIcon, IconColumnInsertRight, IconRowInsertBottom, IconTable, IconTableAdd}
