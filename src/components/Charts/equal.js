/**
 * @Author: Chen Ming <amour>
 * @Date:   2017-12-14T18:13:36+08:00
 * @Email:  amourfrei@163.com
 * @Last modified by:   amour
 * @Last modified time: 2017-12-19T21:49:07+08:00
 */

export default function equal(old, target){
  let r = true;
  for(const prop in old){
    if(typeof old[prop] === 'function' && typeof target[prop] === 'function'){
      if(old[prop].toString() != target[prop].toString()){
        r = false;
      }
    }else if(old[prop] != target[prop]){
      r = false;
    }
  }
  return r;
}
