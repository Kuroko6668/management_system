//项目的菜单配置
export default[
  {
    title: 'home', // 菜单标题名称
    key: 'home', // 对应的path
    icon: 'home', // 图标名称
    path: '/admin/home'//对应路径
  },
  {
    title: 'product',
    key: 'prod_about',
    icon: 'appstore',
    children: [ // 子菜单列表
      {
        title: 'category',
        key: 'category',
        icon: 'unordered-list',
        path: '/admin/prod_about/category'
      },
      {
        title: 'product',
        key: 'product',
        icon: 'tool',
        path: '/admin/prod_about/product'
      },
    ]
  },

  {
    title: 'user management',
    key: 'user',
    icon: 'user',
    path: '/admin/user'
  },
  {
    title: 'role management',
    key: 'role',
    icon: 'safety',
    path: '/admin/role'
  },

  {
    title: 'charts',
    key: 'charts',
    icon: 'area-chart',
    children: [
      {
        title: 'bar',
        key: 'bar',
        icon: 'bar-chart',
        path: '/admin/charts/bar'
      },
      {
        title: 'line',
        key: 'line',
        icon: 'line-chart',
        path: '/admin/charts/line'
      },
      {
        title: 'pie',
        key:  'pie',
        icon: 'pie-chart',
        path: '/admin/charts/pie'
      },
    ]
  },
]
