package org.mem.action;

import java.net.URI;

import android.content.Context;
import android.media.MediaScannerConnection;
import android.media.MediaScannerConnection.MediaScannerConnectionClient;
import android.net.Uri;
import android.util.Log;

public class MediaScanner
{
  private MediaScannerConnection mediaScanConn = null;
  private UploadFileSannerClient client = null;
  private String filePath = null;
  private String fileType = null;
  private String[] filePaths = null;

  public MediaScanner(Context context)
  {
    if (this.client == null) {
      this.client = new UploadFileSannerClient();
    }
    
    if (this.mediaScanConn == null)
      this.mediaScanConn = new MediaScannerConnection(context, this.client);
  }

  public void scanFile(String filepath, String fileType)
  {
    Log.i("MediaScanner", "scanFile(" + filepath + ", " + fileType + ")");

    this.filePath = filepath;
    this.fileType = fileType;

    this.mediaScanConn.connect(); // MediaScannerConnection.onMediaScannerConnected()�Լ� ȣ��
  }

  class UploadFileSannerClient
    implements MediaScannerConnection.MediaScannerConnectionClient
  {
    UploadFileSannerClient()
    {
    	
    }

    // MediaScanner ���񽺰� ������ �� ��� ȣ��
    // ��ĳ���� ���ϵ���  �˾Ƽ� ã�Ƽ�  ��Ȯ�� ���ϸ����� �־��־�� �ȴٴ� ��
    public void onMediaScannerConnected()
    {
      Log.i("MediaScanner", "onMediaScannerConnected(" + MediaScanner.this.filePath + ", " + MediaScanner.this.fileType + ")");

      if (MediaScanner.this.filePath != null) {
        MediaScanner.this.mediaScanConn.scanFile(MediaScanner.this.filePath, MediaScanner.this.fileType);
      }

      if (MediaScanner.this.filePaths != null) {
        for (String file : MediaScanner.this.filePaths) {
          MediaScanner.this.mediaScanConn.scanFile(file, MediaScanner.this.fileType);
        }
      }

      //MediaScanner.access$002(MediaScanner.this, null);
      //MediaScanner.access$102(MediaScanner.this, null);
      //MediaScanner.access$302(MediaScanner.this, null);
    }
    
    // ��ĵ�� ������ ���Ͽ� ���� ���� ���� �Լ�
	public void onScanCompleted(String path, Uri uri) {
		// TODO Auto-generated method stub
		Log.i("MediaScanner", "onScanCompleted(" + path + ", " + uri + ")");
	      Log.i("MediaScanner", "onScanCompleted(" + path + ", " + uri.toString() + ")");

	      
	      MediaScanner.this.mediaScanConn.disconnect();
	}
  }
}