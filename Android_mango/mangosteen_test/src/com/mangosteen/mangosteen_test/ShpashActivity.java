package com.mangosteen.mangosteen_test;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.app.Activity;
import android.view.Menu;

public class ShpashActivity extends Activity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_shpash);
        
        initialize();
    }

    private void initialize() {
		// TODO Auto-generated method stub
    	Handler handler =    new Handler()
        {
            @Override
            public void handleMessage(Message msg)
            {
                finish();    // ��Ƽ��Ƽ ����
            }
        };

        handler.sendEmptyMessageDelayed(0, 3000);    // ms, 3���� �����Ŵ
	}

	@Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_shpash, menu);
        return true;
    }
}
