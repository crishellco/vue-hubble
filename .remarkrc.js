exports.plugins = [
  '@form8ion/remark-lint-preset',
  ['remark-toc', {tight: true}],
  ['validate-links', { repository: false }],
  ['remark-lint-maximum-line-length', 100]
];

exports.settings = {
  listItemIndent: 1,
  emphasis: '_',
  strong: '_',
  bullet: '*',
  incrementListMarker: false
};
