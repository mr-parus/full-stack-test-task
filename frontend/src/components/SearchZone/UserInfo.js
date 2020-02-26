import React from 'react';


function UserInfo(user) {
  return (<>
      <div style={{ textAlign: 'center' }}><b>All data related to the selected item:</b></div>
      <br/>
      <pre>{JSON.stringify(user, '', 2)}</pre>
    </>
  );
}

export default UserInfo;

