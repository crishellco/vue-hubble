const { description } = require('../../package')

module.exports = {
  base: "/",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Vue Hubble',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    logo: '/assets/img/logo.png',
    repo: 'https://github.com/crishellco/vue-hubble',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Guide',
        link: '/guide/getting-started.md',
      },
      {
        text: 'API',
        link: '/api/methods.md',
      },
      {
        text: 'Demo',
        link: 'http://vue-hubble-demo.crishell.co/',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            'getting-started',
            'plugin-options',
            'usage',
            'selector-picker',
          ]
        },{
          title: 'Advanced',
          collapsable: false,
          children: [
            'namespacing',
          ]
        }
      ],
      '/api/': [
        {
          title: 'API',
          collapsable: false,
          children: [
            'methods',
            'properties',
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    'dehydrate'
  ]
}
