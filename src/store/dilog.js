import { defineStore } from 'pinia'

// interface UserInfo {
//   name?: string
//   age?: number
// }

// 第一个参数是id，id必填，且需要保证值唯一
export const dilog = defineStore('dilog', {
  state: ()=> {
     return {
       alarmdilog:false,
       detaildilog:false,
       echarts:false,
	    echartstwo:false,
       gaode:false,
	   tirelist:false
     }
   },
  })