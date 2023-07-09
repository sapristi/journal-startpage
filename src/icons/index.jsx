import { SvgIcon } from '@mui/material';

import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

import {ReactComponent as IconTableAddSvg} from './table-add.svg'

const IconTableAdd = (props) => (
  <SvgIcon {...props}>
    <IconTableAddSvg/>
  </SvgIcon>
)

export {
  AddBoxIcon, DeleteIcon, SaveIcon, AddIcon, IconTableAdd,
  CloseIcon, SettingsIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon,
  CloudSyncIcon
}
