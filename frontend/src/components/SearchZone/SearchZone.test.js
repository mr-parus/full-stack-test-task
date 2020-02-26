import { waitForElement } from '@testing-library/react';
import { mount } from 'enzyme';
import React from 'react';
import userService from '../../services/user.service';
import SearchResult from './SearchResult';
import SearchZone from './SearchZone';

it('should find the search input', () => {
  const wrapper = mount(<SearchZone/>);
  expect(wrapper.exists('#searchField')).toBe(true);
});

it('should find search results in the tree', async () => {
  const mockUsers = [
    {
      address: 'Bater Circle, 339 Posa Grove',
      age: 61,
      fullName: 'Fred Caldwell',
      color: 'yellow',
      id: '5e55aac56a38af33211b8f71'
    },
    {
      address: 'Bater Circle, 339 Posa Grove',
      age: 61,
      fullName: 'Fred2 Caldwell',
      color: 'white',
      id: '5e55aac56a38af33211b8f72'
    }
  ];

  // mock api response
  userService.search = jest.fn().mockReturnValue(Promise.resolve(mockUsers));

  // mock search input change
  const wrapper = mount(<SearchZone/>);
  const searchString = 'Bater';
  const event = {
    preventDefault() {
    },
    target: { value: searchString }
  };
  wrapper
    .find('#searchField input')
    .at(0)
    .simulate('change', event);

  // wait all state changes
  await waitForElement(() => wrapper);
  wrapper.update();


  // check results
  mockUsers.forEach((user) => {
    wrapper.containsMatchingElement(<SearchResult {...user}/>);
  });
});
