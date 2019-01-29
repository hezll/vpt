<template>
	<view v-if="loginPage" class="loginPage">
		<view class="logo">
			<view>
				<image src="../../static/images/myki_logo.jpeg" mode="aspectFit" class="logoimg"></image>
			</view>
			<view class="tip">
				To see your account balance, log in to your myki online account
			</view>
		</view>
		<view class="content">
			<view style="flex-direction:column;width:100%;">
				<view class=" has-mgtb-10 ">
					<input type="number" maxlength="11" v-model="login.phone" placeholder="myki username" class="is-input1 " @input="BindInput"
					 data-val="phone" />
				</view>
				<view class="has-mgtb-20">
					<input v-model="login.password" placeholder="myki password" class="is-input1" @input="BindInput" data-val="password" />
				</view>

				<view class="loginbtn has-mgtb-30">
					<button :loading="login.loading" @tap="defaultHandlerLogin"> {{ login.loading ? "Login...":"Login"}} </button>
				</view>
			</view>
		</view>
		<view>
			<navigator url="#" hover-class="" style="font-size:32upx;padding-top: 20upx;">
				<text>I accept the </text><text class="is-blue"> Privacy Statement</text>
			</navigator>
		</view>
	</view>
	<view v-else style="flex:1;position:fixed;bottom:0;width:100%;">
		<page-head :title="title"></page-head>
		<view class="mykiList">
			<!-- <view class="example-title">左侧滑出</view>
			<view>
				<button type="default" @click="show('left')">显示Drawer</button>
				<uni-drawer :visible="showLeft" mode="left" @close="closeDrawer('left')">
					<view>asfdasdfasdfasdf</view>
					<uni-list>
						<uni-list-item title="Item1"></uni-list-item>
						<uni-list-item title="Item2"></uni-list-item>
						<uni-list-item title="Item3" show-badge="true" badge-text="12"></uni-list-item>
					</uni-list>
					<view class="close">
						<button type="default" @click="hide">关闭Drawer</button>
					</view>
				</uni-drawer>
			</view> -->
			<view class="card" v-for="(item,index) in cards" :key="index">
				<view>
					<image src="../../static/images/myki_logo.jpeg" style="border-radius:50px;height:35px;width:35px;" />
				</view>
				<view style="flex-direction: column;">
					<view style="font-weight: bold;">{{item.cardNum}}</view>
					<view style="padding-top: 18upx;">{{item.holder}}</view>
				</view>
				<view style="flex-direction: column;align-items:flex-end">
					<view style="font-size:28upx">Available</view>
					<view style="font-weight: bold;">{{item.mykiMoney}}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import net from '@/common/js/netUtil.js'
	import con from '@/common/js/constant.js'

	export default {
		data() {
			return {
				cards: [],
				loginPage: true,
				username: '',
				password: '',
				login: {
					loading: false,
					phone: "",
					password: ""
				},

			}
		},

		onLoad: function() {
			if (uni.getStorageSync("mykiLogin")) {
				this.loginPage = false;
				this.cards = uni.getStorageSync("cards");
				this.loadingCards();
			} else {
				this.loginPage = true;
			}
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#c4da2d',
			})
		},

		onPullDownRefresh() {
			this.loadingCards(uni.stopPullDownRefresh());
		},

		methods: {
			loadingCards() {
				let body = {
					username: 'david1022',
					password: '2lg5lcgv'
				}
				net.netUtil(con.MYKI_CARDS_URL, 'GET', body, ret => {
					if (ret) {
						this.cards = ret;
						uni.setStorage({
							key: "cards",
							data: ret
						})
					}
				});
			},
			defaultHandlerLogin: function() {
				this.login.loading = true;
				setTimeout((e => {
					this.login.loading = false;
					this.loginPage = false;
				}), 1500);
				
			},
			BindInput: function(e) {
				var dataval = e.currentTarget.dataset.val;
				this.login[dataval] = e.detail.value;
			},
		},
		onBackPress() {
			if (this.showRigth || this.showLeft) {
				this.hide()
				return true
			}
		}
	}
</script>

<style>
	page {
		/* height: 100%; */
		background-color: #ececec;
	}

	.loginPage {
		flex-direction: column;
		width: 100%;
		align-items: center;
	}

	.logo {
		margin-top: 80rpx;
		flex-direction: column;
		align-items: center;
	}

	.content {
		width: 85%;
		margin: 0 auto;
	}

	.tip {
		color: #6a6d73;
		line-height: 40upx;
		width: 85%;
		font-size: 30upx;
		font-weight: 500;
		padding: 40upx 0;
	}

	.has-mgtb-10 {
		margin-bottom: 10rpx;
	}

	.has-mgtb-20 {
		margin-bottom: 20rpx;
	}

	.has-mgtb-20 {
		margin-bottom: 30rpx;
	}

	.loginbtn button {
		margin-top: 20rpx;
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		color: #333839;
		font-size: 42rpx;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		margin: 0;
		font-family: inherit;
		background: #bed600;
		opacity: 0.8;
		font-weight: bold;
	}

	button:after {
		border: 2rpx solid #f2f2f2;
	}

	.logoimg {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
	}

	.is-blue {
		color: #2A62FF !important;
	}

	.is-input1 {
		height: 88rpx;
		width: 100%;
		line-height: 88rpx;
		padding: 12rpx;
		color: #353535;
		font-size: 32rpx;
		box-sizing: border-box;
		appearance: none;
		border: 2rpx solid #e5e5e5;
		box-shadow: none;
		border-radius: 44rpx;
		outline: 0;
		display: block;
		padding-left: 30rpx;
		margin: 0;
		font-family: inherit;
		background: #fff;
		resize: none;
	}


	.mykiList {
		justify-content: flex-end;
		flex: 1;
		align-items: center;
		flex-direction: column;
	}

	.card {
		color: white;
		/* background-color: #F78248; */
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
		height: 170upx;
		width: 95%;
		flex-direction: row;
		justify-content: space-around;
		padding-top: 15px;
		margin-bottom: -10px;
		background: linear-gradient(orange 0%,
			#F78248 30%);
	}

	.close {
		padding: 30upx;
	}
</style>
