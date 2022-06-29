import Checker from './Checker';

class Toolbox {
  static async asyncForEach<T = any>(array: T[], callback: Function) {
    for (let index = 0; index < array.length; index++) { // eslint-disable-line no-plusplus
      await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
    }
  }

  static intersection<T1 = any, T2 = any>(arr1: T1[], arr2: T2[]) {
    const checker = new Checker();
    checker.isArray(arr1);
    checker.isArray(arr2);

    let shortest: any = arr1;
    let to: any = arr2;
    if (arr1.length > arr2.length) {
      shortest = arr2;
      to = arr1;
    }

    const result = [];
    for (let i = 0; i < shortest.length; i++) { // eslint-disable-line no-plusplus
      if (to.indexOf(shortest[i]) !== -1) {
        result.push(shortest[i]);
      }
    }

    return result;
  }

  static replaceJsonKeyPart(obj: any, target: string, replacement: string) {
    let newObj: any;
    if (Array.isArray(obj)) {
      newObj = [];
      obj.forEach((item, key) => {
        newObj[key] = Toolbox.replaceJsonKeyPart(item, target, replacement);
      });
    } else if (Object.prototype.toString.call(obj) === '[object Object]') {
      newObj = {};
      Object.keys(obj).forEach((key) => {
        newObj[key.replace(target, replacement)] = Toolbox.replaceJsonKeyPart(obj[key], target, replacement); // eslint-disable-line max-len
      });
    } else {
      newObj = obj;
    }

    return newObj;
  }
}

export default Toolbox;
