package com.im.arewethere;

import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** 페이지 로드 완료를 logcat(태그 AreWeThere)에 남긴다. */
public class LogClient extends WebViewClient {
    @Override
    public void onPageFinished(WebView view, String url) {
        Log.i("AreWeThere", "page finished " + url);
    }
}
