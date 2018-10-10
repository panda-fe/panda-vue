# panda-vue

## by Panda-FET

### 版本日志
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

