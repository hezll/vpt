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
			if (routes) {
				this.trainRoutes = routes.filter(item => {
					if (item.route_type == 0) {
						trainRoutesMap[item.route_id] = item.route_name;
						//initialise the checked item
						if (selectedRouteIds) {
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
		},

		methods: {
			checkboxChange: function(e) {
				uni.setStorageSync("selectedRouteIds", e.detail.value);
				this.displayLineNumber(e);
				
				uni.removeStorageSync("fullTimetables");
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
		}
	}
</script>

<style>

</style>
