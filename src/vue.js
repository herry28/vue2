// vue的构造函数，用于创建vue实例
class Vue{
  constructor(options={}){
    // 给vue实例增加属性
    this.$el=options.el
    this.$data=options.data
    this.$methods=options.methods

    // 监视data中的数据
    new Observer(this.$data)

    // 如果指定了el参数，则对el进行解析
    if(this.$el){
      // 负责解析模板的内容：将模板和vue实例传过去
      let c= new Compile(this.$el,this)
      // console.log(c)
    }
  }
}