<template>
	<view>


	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},

		onLoad: function() {
			uni.showLoading({
				title: "loading..."
			});
			var interval = setInterval(function() {
				let directions = uni.getStorageSync("directions");
				let routes = uni.getStorageSync("routes");
				let stopNameMap = uni.getStorageSync("stopNameMap");
				let routeStopMap = uni.getStorageSync("routeStopMap")
				if (directions && routes && stopNameMap && routeStopMap) {
					clearInterval(interval);
					uni.switchTab({
						url:'./timetable/train/timetable',
					})
					uni.hideLoading();
				}
			}, 10);
			console.info('switch go timetable');
		}
	}
</script>

<style>

</style>
