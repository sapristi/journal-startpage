import { SvgIcon } from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

import {IconColumnInsertRight, IconRowInsertBottom, IconTable} from '@tabler/icons-react';

import {ReactComponent as IconTableAddSvg} from './table-add.svg'

const IconTableAdd = (props) => (
  <SvgIcon {...props}>
    <IconTableAddSvg/>
  </SvgIcon>
)

export {AddBoxIcon, DeleteIcon, SaveIcon, AddIcon, IconColumnInsertRight, IconRowInsertBottom, IconTable, IconTableAdd}
