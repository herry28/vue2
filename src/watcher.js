/**
 * watcher模块负责把compile和observer关联起来
*/

class Watcher{
  // vm：当前vue实例
  //expr：data中数据的名字
  // cb：一旦数据变化，需要调用cb 
  constructor(vm,expr,cb){
    this.vm = vm
    this.expr = expr
    this.cb = cb

    // this表新创建的watcher对象，将其存储到Dep.target属性上
    Dep.target=this

    this.oldValue=this.getVMValue(vm,expr)
    //清空Dep.target
    Dep.target=null
  }

  update(){//对外暴露的一个方法，用于更新页面
    let oldValue=this.oldValue
    let newValue=this.getVMValue(this.vm,this.expr)
    if(oldValue!=newValue){
      this.cb(newValue,oldValue)
    }
  }

  getVMValue(vm,expr){//用于获取vm中的数据
    let data=vm.$data//获取vm中的data数据
    expr.split('.').forEach(key=>{
      data=data[key] //拿到复杂数据
    })
    return data
  }
}



/**
 * dep对象用于管理所有的订阅者和通知这些订阅者
 */
class Dep{
  constructor(){
    this.subs=[]//用于管理订阅者
  }

  addSub(watcher){//添加订阅者
    this.subs.push(watcher)
  }

  notify(){//通知订阅者
    // 遍历所有的订阅者，调用watcher和update方法
    this.subs.forEach(sub=>{
      sub.update()
    })
  }

}