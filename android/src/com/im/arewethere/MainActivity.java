package com.im.arewethere;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

/** 목업 뷰어: 앱 안에 묶은 HTML 화면 시안(assets/mockup)을 띄운다. 차량 SDK 연동은 아직 없다. */
public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setAllowFileAccess(true);
        web.setBackgroundColor(0xFF000000);
        web.setWebViewClient(new LogClient());
        web.setWebChromeClient(new LogChrome());
        setContentView(web);
        web.loadUrl("file:///android_asset/mockup/index.html");
    }
}
