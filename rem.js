/* eslint func-names: 0 wrap-iife: 0 */
(function (doc, win) {
  const docEl = doc.documentElement
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  const recalc = function () {
    const { clientWidth } = docEl
    if (!clientWidth || clientWidth > 780 || clientWidth < 310) return
    // 以 iphone6/7 为基准
    docEl.style.fontSize = parseInt(100 * (clientWidth / 375), 10) + 'px'
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
