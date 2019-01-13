<script>
	import util from '@/common/js/util.js'
	import net from '@/common/js/netUtil.js'
	import con from '@/common/js/constant.js'

	export default {
		onLaunch: function() {
			//util.getLocation();

			if (!uni.getStorageSync('stopNameMap')) {
				uni.request({
					url: 'http://47.75.7.246:8080/api/ptv/initStopReverse', //仅为示例
					success: (res) => {
						uni.setStorageSync('stopNameMap', res.data);
						console.log('init the stop name map');
					}
				});
			};
			if (!uni.getStorageSync("routes")) {
				uni.request({
					url: 'https://timetableapi.ptv.vic.gov.au/v3/routes?devid=3000969&signature=602DAAA6BFB77BC2DF5B40FA15F3953FD974F3DF',
					method: 'GET',
					data: {},
					success: res => {
						uni.setStorageSync("routes", res.data.routes);
						console.log('init the routes');
					},
					fail: () => {},
					complete: () => {}
				});
			}
			if (!uni.getStorageSync("directions")) {
				net.netUtil(con.DIRECTION_URL, 'GET', {}, ret => {
					if (ret) {
						uni.setStorageSync("directions",ret);
					}
				});
			}
			uni.removeStorageSync("fullTimetables");

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./common/uni.css";

	page,
	view {
		display: flex;
		/* uni-app默认使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。若不需要flex布局可删除本行*/
	}
</style>
