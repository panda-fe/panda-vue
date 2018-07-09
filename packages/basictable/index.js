import BasicTable from './src/main';

/* istanbul ignore next */
BasicTable.install = function(Vue) {
  Vue.component(BasicTable.name, BasicTable)
}

export default BasicTable
