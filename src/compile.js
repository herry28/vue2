// 专门负责解析模板内容

class Compile{
  constructor(el,vm){
    this.el=typeof el==='string'?document.querySelector(el):el //el为new Vue时传递的选择器
    this.vm=vm //vm为vue实例

    // 编译模板
    if(this.el){
      // 1.把el中所有子节点放入内存中（fragment）
      let fragment = this.node2fragment(this.el)
      // console.dir(fragment)
      // 2.在内存中编译fragment
      this.compile(fragment)
      // 3.把fragment一次性添加到页面
      this.el.appendChild(fragment)
    }
  }

  /**
   * 
   * 核心方法
   */
  node2fragment(node){//将el的所有子节点放入到内存fragment中
    let fragment=document.createDocumentFragment()
    // 把el中所有子节点挨个添加到文档碎片中
    let childNodes=node.childNodes
    // console.log(childNodes)
    this.toArray(childNodes).forEach(node=>{
      // console.log(node)
      fragment.appendChild(node)
    })
    return fragment
  }

  compile(fragment){//在内存中编译文档碎片
    let childNodes=fragment.childNodes
    this.toArray(childNodes).forEach(node=>{
      // 编译子节点
      if(this.isElementNode(node)){// 如果是元素节点，需要解析指令
        this.compileElement(node)
      }
      if(this.isTextNode(node)){// 如果是文本节点，需要解析插值表达式
        this.compileText(node)
      }
      if(node.childNodes && node.childNodes.length>0){//如果当前节点还有子节点，需要递归解析
        this.compile(node)
      }
    })
  }

  compileElement(node){//解析元素节点
    // console.log(node)
    // 1.获取当前节点下的所有属性
    let attributes=node.attributes
    // 2.解析v指令（以v-开头）
    this.toArray(attributes).forEach(attr=>{//循环遍历元素节点上的属性
      // console.log(attr)
      let attrName=attr.name //得到属性名
      let expr=attr.value //得到属性值
      if(this.isDirective(attrName)){//如果是v-开头的指令
        let type=attrName.slice(2)
        if(this.isEventDirective(type)){//如果是v-on指令
          CompileUtil['eventHandler'](node,this.vm,type,expr)
        }else{//根据不同的type，调用compileUtil对象的不同方法
          CompileUtil[type] && CompileUtil[type](node,this.vm,expr)
        }
        // if(type==='text'){//如果是v-text指令
        //   node.textContent=this.vm.$data[expr]
        // }
        // if(type==='html'){//如果是v-text指令
        //   node.innerHTML=this.vm.$data[expr]
        // }
        // if(type==='model'){//如果是v-model指令
        //   node.value=this.vm.$data[expr]
        // }
        // if(this.isEventDirective(type)){//如果是v-on指令
        //   // 获取事件类型
        //   let eventType=type.split(':')[1]
        //   //给当前元素注册点击事件  
        //   node.addEventListener(eventType,this.vm.$methods[expr].bind(this.vm))//让this指向vm
        // }
      }
    })
  }

  compileText(node){//解析文本节点
   CompileUtil.mustache(node,this.vm)
  }


   /**
   * 
   * 工具方法
   */
  toArray(likeArray){
    return [].slice.call(likeArray)
  }

  isElementNode(node){//是否是元素节点
    return node.nodeType===1
  }

  isTextNode(node){//是否是文本节点
    return node.nodeType===3
  }

  isDirective(attrName){//是否是指令
    return attrName.startsWith('v-')
  }

  isEventDirective(type){//是否是事件指令
    return type.split(':')[0]==='on'
  }
}

/**
 * 工具对象
 */
let CompileUtil={//可以省很多的判断
  mustache(node,vm){//处理{{}}
    let text = node.textContent //得到文本节点的内容
    let reg = /\{\{(.+)\}\}/
    if(reg.test(text)){//获取带{{}}的文本内容
      let expr = RegExp.$1 //获取插值表达式里的内容
      node.textContent = text.replace(reg,this.getVMValue(vm,expr))   
    } 
  },

  text(node,vm,expr){//处理v-text指令
    node.textContent=this.getVMValue(vm,expr)
  },

  html(node,vm,expr){//处理v-html指令
    node.innerHTML=this.getVMValue(vm,expr)
  },

  model(node,vm,expr){//处理v-model指令
    node.value=this.getVMValue(vm,expr)
  },

  eventHandler(node,vm,type,expr){//处理v-on指令
    // 获取事件类型
    let eventType=type.split(':')[1]
    let fn=vm.$methods && vm.$methods[expr]
    if(eventType && fn){
       //给当前元素注册点击事件  
    node.addEventListener(eventType,fn.bind(vm))//让this指向vm
    }
  },

  getVMValue(vm,expr){//用于获取vm中的数据
    let data=vm.$data//获取vm中的data数据
    expr.split('.').forEach(key=>{
      data=data[key] //拿到复杂数据
    })
    return data
  }
}