import { mount } from 'enzyme';
import React from 'react';

import { DropZone } from './DropZone';

it('Upload Input', () => {
  const wrapper = mount(<DropZone/>);
  expect(wrapper.find('#uploadField')).toHaveLength(1);
  expect(wrapper.find('#uploadField').get(0).type).toBe('input');
});

it('Upload Button', () => {
  const wrapper = mount(<DropZone/>);
  expect(wrapper.exists('#uploadButton')).toBe(true);
});

