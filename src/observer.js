/**
 * observe.js用于给data中所有的数据添加setter和getter（数据劫持）
 * */ 

 class Observer{
   constructor(data){
    this.data = data
   }

    //核心方法
    walk(data){//遍历data中所有数据，再添加上getter和setter
      if(!data || typeof data !='object'){
        return
      }
      Object.keys(data).forEach(key=>{//为data中的key设置getter和setter
        this.defineReactive(data,key,data[key])
        this.walk(data[key])//若data[key]是复杂数据，则递归walk()
      })
    }  

    // data中的每个数据都应该维护一个dep对象
    defineReactive(obj,key,value){//定义响应式数据（数据劫持）
      let that = this
      Object.defineProperty(obj,key,{
        configurable:true,
        enumerable:true,
        get(){
          // 如果Dep.target中有watcher对象，则存储订阅者
          Dep.target && departFocus.addSub(Dep.target)
          return value
        },
        set(newValue){
          if(value===newValue){
            return
          }
          console.log('set')
          value=newValue
          // 如果newValue是一个对象，也应该进行劫持
          that.walk(newValue)
          // 发布通知，让所有的订阅者更新内容
          dep.notify()
        }
      })
    }
 }