import { makeStyles } from '@material-ui/core/styles';

export const useStylesCustom = makeStyles(theme => ({
  logo: {
    width: 'auto',
    height: 40,
    marginRight: theme.spacing(2),
  },
  // Agrega más estilos según necesites
}));