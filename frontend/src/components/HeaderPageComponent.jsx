import { Grid, Header } from 'semantic-ui-react';

const HeaderPageComponent = ({ title, description, actions = null }) => (
  <Grid stackable verticalAlign="middle">
    <Grid.Row>
      <Grid.Column computer={10} tablet={16} mobile={16}>
        <Header as="h1" size="huge">
          {title}
          {description ? (
            <Header.Subheader className="muted-copy">{description}</Header.Subheader>
          ) : null}
        </Header>
      </Grid.Column>
      {actions ? (
        <Grid.Column computer={6} tablet={16} mobile={16} textAlign="right">
          <div className="page-actions">{actions}</div>
        </Grid.Column>
      ) : null}
    </Grid.Row>
  </Grid>
);

export default HeaderPageComponent;
