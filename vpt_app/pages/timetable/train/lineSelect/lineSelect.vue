<template>
	<view class="content uni-column" style="flex:1">
		<view style="justify-content: center;align-items: center;padding: 20upx;">
			{{trainLineDisplay}}
		</view>
		<view style="flex:1">
			<checkbox-group @change="checkboxChange" style="flex:1">
				<view style="justify-content: space-between;border-bottom: 1upx #D9D9D9 solid">
				</view>
				<label class="checkbox" v-for="item in trainRoutes" :key="item.route_id">
					<view style="justify-content:space-between;padding:20upx;border-bottom: 1upx #D9D9D9 solid;font-weight: bold;">
						<view>{{item.route_name}} Line</view>
						<view>
							<checkbox :value="item.route_id" :checked="item.checked" />
						</view>
					</view>
				</label>
			</checkbox-group>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				trainRoutes: [],
				//trainRoutesMap:{},
				trainLineDisplay: "Select Your Train Lines"
			};
		},

		onLoad: function(e) {
			let trainRoutesMap = {};
			let routes = uni.getStorageSync("routes");
			let selectedRouteIds = uni.getStorageSync("selectedRouteIds");
			if (routes != null && routes != "") {
				this.trainRoutes = routes.filter(item => {
					if (item.route_type == 0) {
						trainRoutesMap[item.route_id] = item.route_name;
						//initialise the checked item
						if (selectedRouteIds.length > 0) {
							selectedRouteIds.filter(id => {
								if (id == item.route_id) item.checked = true;
							})
						}
						return item;
					}
				});
			}
			uni.setStorageSync("trainRoutesMap", trainRoutesMap);
			this.displayLineNumber();
			//网络加载
			this.loadingRouteData();
		},

		methods: {
			checkboxChange: function(e) {
				uni.setStorageSync("selectedRouteIds", e.detail.value);
				this.displayLineNumber(e);
			},

			displayLineNumber() {
				let routeIds = uni.getStorageSync("selectedRouteIds");
				if (routeIds != null && routeIds.length > 0) {
					let number = routeIds.length;
					if (number == 1) {
						let trainRoutesMap = uni.getStorageSync("trainRoutesMap");
						let trainName = trainRoutesMap[routeIds[0]];
						this.trainLineDisplay = trainName + " line";
					} else {
						this.trainLineDisplay = number + " lines";
					}
				} else {
					this.trainLineDisplay = "Select Your Train Lines";
				}
			},

			loadingRouteData() {
				uni.request({
					url: 'https://timetableapi.ptv.vic.gov.au/v3/routes?devid=3000969&signature=602DAAA6BFB77BC2DF5B40FA15F3953FD974F3DF',
					method: 'GET',
					data: {},
					success: res => {
						uni.setStorageSync("routes", res.data.routes);
						//this.trainRoutes = res.data.routes.filter(item => item.route_type == 0);
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>

</style>
