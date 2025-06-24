/*import { makeStyles } from '@material-ui/core';*/
import CustomLogoFull from './backstage-logo.png';

const LogoFull = () => {
  return (
    <img
      src={CustomLogoFull}
      alt="Backstage Logo"
      style={{
        maxWidth: '350%',
        height: 'auto',
      }}
    />
  );
};

export default LogoFull;
