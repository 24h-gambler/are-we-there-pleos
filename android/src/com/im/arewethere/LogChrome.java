package com.im.arewethere;

import android.util.Log;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;

/** 목업 JS 콘솔 메시지를 logcat(태그 AreWeThere)에 남긴다. */
public class LogChrome extends WebChromeClient {
    @Override
    public boolean onConsoleMessage(ConsoleMessage m) {
        Log.i("AreWeThere", "console " + m.message() + " @" + m.lineNumber());
        return true;
    }
}
