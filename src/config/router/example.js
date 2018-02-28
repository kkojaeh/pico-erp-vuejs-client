import {load} from './default';

let exampleMeta = {
  title: '예제',
  auth: false,
  frame: true
};

export default [{
  path: '/example/attachment',
  component: load('example/Attachment'),
  meta: exampleMeta
},{
  path: '/example/html-editor',
  component: load('example/HtmlEditor'),
  meta: exampleMeta
}];
