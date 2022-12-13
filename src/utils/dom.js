import Vue from 'vue'
const isServer = Vue.prototype.$isServer

export const on = (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler, useCapture = false) {
      if (element && event && handler) {
        element.addEventListener(event, handler, useCapture)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

export const off = (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler, useCapture = false) {
      if (element && event) {
        element.removeEventListener(event, handler, useCapture)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

// 获取 display: none 的节点宽度和高度
export const getSize = elem => {
  var width
  var height
  var noneNodes = []
  var nodeStyle = []

  getNoneNode(elem) // 获取多层display：none;的元素
  setNodeStyle()
  width = elem.clientWidth
  height = elem.clientHeight
  resumeNodeStyle()

  return {
    width: width,
    height: height
  }

  function getNoneNode(node) {
    var display = getStyles(node).getPropertyValue('display')
    var tagName = node.nodeName.toLowerCase()
    if (display !== 'none' && tagName !== 'body') {
      getNoneNode(node.parentNode)
    } else {
      noneNodes.push(node)
      if (tagName !== 'body') getNoneNode(node.parentNode)
    }
  }

  // 这方法才能获取最终是否有display属性设置，不能style.display。
  function getStyles(elem) {
    // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
    // IE throws on elements created in popups
    // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    var view = elem.ownerDocument.defaultView

    if (!view || !view.opener) {
      view = window
    }
    return view.getComputedStyle(elem)
  }

  function setNodeStyle() {
    var i = 0
    for (; i < noneNodes.length; i++) {
      var visibility = noneNodes[i].style.visibility
      var display = noneNodes[i].style.display
      var style = noneNodes[i].getAttribute('style')
      // 覆盖其他display样式
      noneNodes[i].setAttribute(
        'style',
        'visibility:hidden;display:block !important;' + style
      )
      nodeStyle[i] = {
        visibility: visibility,
        display: display
      }
    }
  }

  function resumeNodeStyle() {
    var i = 0
    for (; i < noneNodes.length; i++) {
      noneNodes[i].style.visibility = nodeStyle[i].visibility
      noneNodes[i].style.display = nodeStyle[i].display
    }
  }
}
