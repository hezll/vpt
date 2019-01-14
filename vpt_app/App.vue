<script>
	import util from '@/common/js/util.js'
	import net from '@/common/js/netUtil.js'
	import con from '@/common/js/constant.js'

	export default {
		onLaunch: function() {
			util.getLocation(nearme => {
				if (nearme) {
					let selectedStop = uni.getStorageSync("selectedStop");
					let ret = nearme.filter(s => s == selectedStop['stopName']);
					if (ret.length == 0) {
						let stopNameMap = uni.getStorageSync("stopNameMap");
						let stopId = stopNameMap[nearme[0]];
						uni.setStorageSync("selectedStop", {
							'stopName': nearme[0],
							'stopId': stopId,
						});
						let routeStopMap = uni.getStorageSync("routeStopMap");
						let lines = routeStopMap[stopId];
						uni.setStorageSync("selectedRouteIds", lines);
					}
				}
			});
			this.initDirections();
			this.initStopNameMap();
			this.initRoutes();
			this.initRouteStop();
			uni.removeStorageSync("fullTimetables");
		},

		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		},
		methods: {

			initDirections() {
				if (!uni.getStorageSync("directions")) {
					net.netUtil(con.DIRECTION_URL, 'GET', {}, ret => {
						if (ret) {
							uni.setStorageSync("directions", ret);
						}
					});
				}
			},
			initStopNameMap() {
				if (!uni.getStorageSync('stopNameMap')) {
					net.netUtil(con.STOP_NAME_MAP_URL, 'GET', {}, ret => {
						if (ret) {
							uni.setStorageSync('stopNameMap', ret);
						}
					});
				};
			},

			initRoutes() {
				if (!uni.getStorageSync("routes")) {
					uni.request({
						url: 'https://timetableapi.ptv.vic.gov.au/v3/routes?devid=3000969&signature=602DAAA6BFB77BC2DF5B40FA15F3953FD974F3DF',
						method: 'GET',
						data: {},
						success: res => {
							uni.setStorageSync("routes", res.data.routes);
							console.log('init the routes');
						}
					});
				}
			},

			initRouteStop() {
				if (!uni.getStorageSync("routeStopMap")) {
					net.netUtil(con.ROUTE_STOP_MAP_URL, 'GET', {}, ret => {
						if (ret) {
							uni.setStorageSync("routeStopMap", ret);
						}
					});
				}
			}


			// 				let err, res;
			// 				[err, res] = await uni.request({
			// 					url: con.DIRECTION_URL,
			// 					data: {}
			// 				});
			// 				console.log("数据：", err, res.data);
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
