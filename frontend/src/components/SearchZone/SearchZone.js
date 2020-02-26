import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';

import Autocomplete from '@material-ui/lab/Autocomplete';
import throttle from 'lodash/throttle';
import React, { useMemo } from 'react';

import { search as searchUsers } from '../../services/user.service';
import SearchResult from './SearchResult';
import UserInfo from './UserInfo';


function SearchZone() {
  const [open, setOpen] = React.useState(false);
  const [searchString, setSearchString] = React.useState('');
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [{ loading, values: options }, setOptions] = React.useState({ loading: false, values: [] });

  const requestSearchUsers = useMemo(() => throttle(searchUsers, 150), []);
  const handleInputChange = useMemo(() => e => setSearchString(e.target.value), []);
  const handleSelectChange = useMemo(() => (e, option) => setSelectedOption(option), []);

  React.useEffect(() => {
    if (loading) {
      return;
    }

    // For adding search results only if search is still active
    let active = true;

    (async () => {
      if (!searchString) {
        return;
      }

      setOptions({ values: options, loading: true });
      const users = await requestSearchUsers(searchString);
      if (active) {
        setOptions({ values: users, loading: false });
      } else {
        setOptions({ values: [], loading: false });
      }
    })();

    return () => {
      active = false;
    };
  }, [searchString, requestSearchUsers]);

  React.useEffect(() => {
    if (!open) {
      setOptions({ values: [], loading: false });
    }
  }, [open]);

  return (
    <>
      <Autocomplete
        disableListWrap={false}
        disableOpenOnFocus
        getOptionLabel={(option) => option.fullName}
        groupBy={option => option.color}
        loading={loading}
        onChange={handleSelectChange}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        options={options}
        renderOption={(option, state) => {
          return (<SearchResult {...option} searchString={searchString}/>);
        }}
        style={{ width: '100%' }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search users"
            onChange={handleInputChange}
            InputProps={{
              ...params.InputProps,
              id: 'searchField',
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="primary" size={20}/> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        )}
      />
      <br/>
      <br/>
      {selectedOption ? <UserInfo {...selectedOption}/> : null}
    </>
  );
}

export default SearchZone;
