import 'jest-enzyme';
import '@testing-library/jest-dom/extend-expect';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

global.document.createRange = () => ({
  setStart: () => {
  },
  setEnd: () => {
  },
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document
  }
});
