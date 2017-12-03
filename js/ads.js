var ads = {
	init: function(){
		admob.initAdmob("ca-app-pub-3644885202752337/8471325200","ca-app-pub-3644885202752337/9250054400");
		admob.showBanner(admob.BannerSize.BANNER,admob.Position.BOTTOM_APP);
		document.addEventListener(admob.Event.onInterstitialReceive, ads.onInterstitialReceive, false);//show in ad receive event fun need add receive listener
		admob.cacheInterstitial();// load admob Interstitial
	},
	onInterstitialReceive: function(message) {//show in ad receive event fun
		admob.showInterstitial();
	}
	
};