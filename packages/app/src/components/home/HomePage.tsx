import { HomePageToolkit, HomePageCompanyLogo } from '@backstage/plugin-home';
import { Content, Page } from '@backstage/core-components';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { Grid, makeStyles } from '@material-ui/core';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CategoryIcon from '@material-ui/icons/Category';


const useStyles = makeStyles(theme => ({
  searchBar: {
    display: 'flex',
    maxWidth: '60vw',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    width: '100%',
    borderRadius: '50px',
    margin: 'auto',
    '& fieldset': {
      border: 'transparent'
    }
  },
  logo: {
    width: 'auto',
    height: 200,
    margin: '20px 0',
  },
}));

export const HomePage = () => {
  const classes = useStyles();
  const logo = (
    <HomePageCompanyLogo
      logo={
        <img 
          src="/logo_profuturo.png"
          className={classes.logo}
        />
      }
    />
  );

  return (
    <Page themeId="home">
      <Content>
        <Grid container justifyContent="center" spacing={6}>
          {/* Add the logo at the top */}
          <Grid container item xs={12} justifyContent="center">
            {logo}
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <div className={classes.searchBar}>
              <HomePageSearchBar placeholder="Buscar en la plataforma..." />
            </div>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={12} md={6}>
              <HomePageToolkit
                tools={[
                  {
                    url: '/catalog',
                    label: 'Catalog',
                    icon: <CategoryIcon />,
                  },
                  {
                    url: '/docs',
                    label: 'TechDocs',
                    icon: <LibraryBooks />,
                  },
                  // Agrega más herramientas según necesites
                ]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};