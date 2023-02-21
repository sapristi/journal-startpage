import {Button} from './base';
import {Fragment} from "react"

export const FileUpload = ({id, label, accept, handler, readerMethod}) => {

  const handleFileUpload = (event) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    const { name } = file;

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt?.target?.result) {
        return;
      }
      const { result } = evt.target;
      handler({name, content: result})
    };
    reader[readerMethod](file);
  };

  return (
    <Fragment>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id={id}
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor={id}>
        <Button  component="span" >
          {label}
        </Button>
      </label>
    </Fragment>
  )
}
