# panda-vue
![npm](https://img.shields.io/npm/v/panda-vue.svg)
![license](https://img.shields.io/github/license/jserwang/rc-bmap.svg)

> by Panda-FET



## Contents

### mixins

1. **canJumpMixin**：在组件要跳转的时候多此一举的拦住用户并且问他，你真的要跳转吗
2. **sysParamsMixin**：获取系统数据字典



### components

1. **BasicTable**：基础表格组件

## ToDos

- [ ] 按需加载与全局加载可选切换
- [ ] 文档 Docs
- [ ] mixins、components的使用Demo





## Logs
   0.1.3 : 
   修改操作列按钮样式及功能  

* 默认是icon显示
* 纯文本显示  就不传icon
* icon加文本  加type字段  同element
```
{
  label: '编辑',
  func: this.editDialogShow,
  icon: 'el-icon-my-bianji',
  color: '#ffffff',
  type: 'primary',
  disabledfunc: () => !this.modify.show
}
```

## 协议

[MIT 许可证](https://opensource.org/licenses/MIT)
