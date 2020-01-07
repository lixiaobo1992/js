
// this.dealList //处理数据函数,外部添加 接收 array
// 默认 listData 数据，当前列表数据
// import { arrayToHeavy } from '@/utils/arrayUtil'

export default {

  data () {
    return {
      finishedTip: '没有更多数据了',
      loadingTip: '加载中...',
      pullLoading: false, // 正在loading 状态
      isReturnData: true, // 上次请求数据是否返回
      finished: false, // 是否到底
      scrollCheck: false,
      pullError: false,

      listData: [], //

      pullParamsDefault: { // 默认参数
        pageNum: 1,
        pageLimit: 20,
      },
      pullParams: {}, // 参数
    }
  },

  methods: {
    // 初始化参数
    initPullList() {
      this.pullParams.pageNum = 1
      this.finished = false // 是否到底
      this.pullLoading = false
    },
    // 刷新
    onRefresh() {
      this.initPullList()
      window.scrollTo(0, 10)
    },
    // 加载下一页
    onScrollToLower() {
      // 已到底部
      if (this.finished) {
        console.log('没有更多数据了')
        return;
      }
      // 显示loading
      this.pullLoading = true;
      //
      // this.finished = true;
      const { pageNum = 1 } = this.pullParams
      const lastNum = (pageNum && pageNum > 0) ? pageNum : (this.pullParamsDefault.pageNum || 1)
      this.pullModel({
        ...this.pullParamsDefault,
        ...this.pullParams,
        last_id: (lastNum - 1) * this.pullParamsDefault.pageLimit
      }, (res) => {
        if (this.pullLoading && !this.isReturnData) {
          this.isReturnData = true;
          this.pullLoading = false;
          return;
        }
        // this.diffTime = res.timestamp * 1000 - Date.now()
        this.pullLoading = false
        this.dealData(res)
      }, (err) => {
        this.pullLoading = false
        if (err.errno === 20002) {
          // this.$forward('login')
          return true
        }
      }, this)
    },

    // 统一api
    pullModel(...rest) { // 需要外部重写
      //
    },
    // 处理数据业务逻辑
    dealData(res = {}) { //
      // const { pageNum } = this.pullParams;

      const data = {};
      data.list = res.data && (res.data.list || res.data) || [];
      console.log(this.finished)
      // 是否到最后一页
      const hasMore = res.pagination && res.pagination.has_more || false;
      this.finished = !hasMore
      // console.log(this.finished)
      if (hasMore) {
        this.pullParams.pageNum += 1; // 增加页数
      }

      if (typeof this.dealList === 'function') { // dealList 外部重写
        const { list } = data;
        let temp = [];
        if (list.length) {
          temp = this.dealList(list) || [];
          if (!temp) {
            // wx.showToast('处理数据返回格式有问题');
            console.warn('处理数据返回格式有问题')
            return false;
          }
        } else {
          console.log(this.finished, this.pullParams.pageNum)
          console.warn('无数据');

          this.listData = [];
          return false;
        }

        data.list = temp;
      }

      // 数组去重
      // const newArray = arrayToHeavy(tempArray)
      // console.log(data.list)
      this.listData = [...this.listData, ...data.list]
      // console.log(this.listData)
      // console.log(typeof this.afterPullData)
      if (typeof this.afterPullData === 'function') {
        this.afterPullData();
      }
    }
  }

}
