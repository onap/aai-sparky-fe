import TreeNode from 'generic-components/treeNode/TreeNode';
import React from 'react';
import { mount } from 'enzyme';

describe('TreeNode', () => {
  let treeNode;

  beforeEach(() => {
    treeNode = mount(<TreeNode node={{title: 'AAA'}}/>).instance();
  });


  it('Should be invisible when created', () => {
    // then
    expect(treeNode.state['visible']).toEqual(false)
  });

  it('Should be visible when toggled', () => {
    // given
    expect(treeNode.state['visible']).toEqual(false)

    // when
    treeNode.toggle();

    // then
    expect(treeNode.state['visible']).toEqual(true)
  });

  it('Should be invisible when double toggled', () => {
    // given
    expect(treeNode.state['visible']).toEqual(false);

    // when
    treeNode.toggle();
    treeNode.toggle();

    // then
    expect(treeNode.state['visible']).toEqual(false);
  });

});
