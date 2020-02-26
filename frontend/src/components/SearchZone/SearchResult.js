import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Highlighter from 'react-highlight-words';

const SearchResult = (option) => {
  return (<Grid container alignItems='center' justify="space-between">
    <Grid item xs={1}>
      <Avatar style={{ backgroundColor: 'black', color: option.color }}/>
    </Grid>
    <Grid item xs={10}>
      <Typography
        component="span"
        variant="body2"
        color="textPrimary"
      >
        <Highlighter
          searchWords={[option.searchString]}
          autoEscape={true}
          textToHighlight={option.fullName}
        />
      </Typography>
      <Typography
        m={0}
        component="span"
        variant="caption"
        color="textSecondary"
      >
        {' - '}
        <Highlighter
          searchWords={[option.searchString]}
          autoEscape={true}
          textToHighlight={option.address}
        />
      </Typography>
    </Grid>
  </Grid>);
};

export default SearchResult;
