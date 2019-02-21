const paginationBev = Behavior({
    data: {
        dataArray: [],
        noneResult: false,
        loading: false,
        pageUtil: {
            page: 1,
            limit: 10,
            order: '',
            sidx: ''
        },
        totalPage: 2,
    },
    methods: {
        setMoreData(dataArray, isPull) {
            if (isPull) {
                var tempArray = dataArray;
            } else {
                var tempArray = this.data.dataArray.concat(dataArray);
            }
            this.setData({
                dataArray: tempArray
            })
        },

        getCurrentStart() {
            return this.data.pageUtil
        },

        setTotal(totalPage) {
            this.data.totalPage = totalPage
            if (totalPage == 0) {
                this.setData({
                    noneResult: true
                })
            }
        },

        hasMore() {
            if (this.data.pageUtil.page > this.data.totalPage) {
                return false
            } else {
                return true
            }
        },

        initialize() {
            this.setData({
                dataArray: [],
                noneResult: false
            })

            this.data.totalPage = 2
        },
        isLocked() {
            return this.data.loading ? true : false
        },

        locked() {
            this.setData({
                loading: true
            })
        },

        unLocked() {
            this.setData({
                loading: false
            })
        }
    }
})

export {
    paginationBev
}