/**
 *
 * 判断一个变量是否是一个对象
 * @export
 * @template T
 * @param {*} obj
 * @return {*}  {obj is T}
 */
export function isObject<T = any>(obj: any): obj is T {
  return Object.prototype.toString.call(obj) == "[object Object]";
}

/**
 *
 * 判断一个变量是否是js的基础数据类型 （非Array和Object类型）
 * @export
 * @param {*} value
 * @return {*}
 */
export function isPrimitive(value: any) {
  return !isArray(value) && !isObject(value);
}

/**
 *
 * 判断一个变量是否是数组类型
 * @export
 * @template T
 * @param {*} obj
 * @return {*}  {obj is Array<T>}
 */
export function isArray<T>(obj: any): obj is Array<T> {
  return Object.prototype.toString.call(obj) == "[object Array]";
}

/**
 *
 * 判断一个变量是否是字符串类型
 * @export
 * @param {*} obj
 * @return {*}  {obj is String}
 */
export function isString(obj: any): obj is String {
  return Object.prototype.toString.call(obj) == "[object String]";
}

export function isBoolean(obj: any): obj is boolean {
  return Object.prototype.toString.call(obj) == "[object Boolean]";
}
/**
 *
 * 判断一个变量是否是Blob类型
 * @export
 * @param {*} obj
 * @return {*}  {obj is Blob}
 */
export function isBlob(obj: any): obj is Blob {
  return Object.prototype.toString.call(obj) == "[object Blob]";
}

/**
 *
 * 判断一个变量是否是number类型
 * @export
 * @param {*} obj
 * @return {*}  {obj is Number}
 */
export function isNumber(obj: any): obj is Number {
  return Object.prototype.toString.call(obj) == "[object Number]";
}

/**
 *
 * 判断一个变量是否是函数类型
 * @export
 * @param {*} obj
 * @return {*}  {obj is Function}
 */
export function isFunction<T>(obj: any): obj is T {
  return Object.prototype.toString.call(obj) == "[object Function]";
}

/**
 *
 * 判断一个变量是否是Date类型
 * @export
 * @param {*} obj
 * @return {*}  {obj is Function}
 */
export function isDate(obj: any): obj is Date {
  return Object.prototype.toString.call(obj) == "[object Date]";
}

/**
 *
 * 判断一个变量是否是Symbol类型
 * @export
 * @param {*} obj
 * @return {*}  {obj is Symbol}
 */
export function isSymbol(obj: any): obj is Symbol {
  return Object.prototype.toString.call(obj) == "[object Symbol]";
}

/**
 *
 * 判断是否为空
 * @export
 * @param {*} obj
 * @return {*}  {boolean}
 */
export function isEmpty(obj: any): boolean {
  return obj === undefined || obj === null || obj === "";
}

export function getScrollTop(
  currentNode: HTMLElement,
  parentNode: HTMLElement
) {
  let total = 0,
    node: HTMLElement | null = currentNode.parentNode as HTMLElement;
  while (node && node != parentNode) {
    const srollTop = node.scrollTop
      ? node.scrollTop
      : document.scrollingElement
      ? document.scrollingElement.scrollTop
      : 0;
    total = total + srollTop;
    node = node.parentNode as HTMLElement;
  }
  total =
    total + node.scrollTop
      ? node.scrollTop
      : document.scrollingElement
      ? document.scrollingElement.scrollTop
      : 0;
  return total;
}

export function getScrollYNode(currentNode?: HTMLElement) {
  if (!currentNode) {
    return document;
  }
  let node = currentNode.parentNode as HTMLElement;
  while (node && node.scrollHeight <= node.clientHeight) {
    node = currentNode.parentNode as HTMLElement;
  }
  return node ? node : document;
}
