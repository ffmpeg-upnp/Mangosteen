/*
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
package net.sf.webdav;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import net.sf.webdav.exceptions.WebdavException;
import android.util.Log;

/**
 * Reference Implementation of WebdavStore
 * 
 * @author joa
 * @author re
 */
public class LocalFileSystemStore implements IWebdavStore {

    private static org.slf4j.Logger LOG = org.slf4j.LoggerFactory
            .getLogger(LocalFileSystemStore.class);

    private static int BUF_SIZE = 65536;

    private File _root = null;

    // �߰�~~
    private ShareFilter sf = null;
    
    public LocalFileSystemStore(File root) {
        _root = root;
  
        //�߰�~~
        this.sf = new ShareFilter(this._root);
    }

    public ITransaction begin(Principal principal) throws WebdavException {
        LOG.trace("LocalFileSystemStore.begin()");
        
        //�߰�~
        //this.sf.begin(principal);
        
        if (!_root.exists()) {
            if (!_root.mkdirs()) {
                throw new WebdavException("root path: "
                        + _root.getAbsolutePath()
                        + " does not exist and could not be created");
            }
        }
        return null;
    }

    public void checkAuthentication(ITransaction transaction)
            throws SecurityException {
        LOG.trace("LocalFileSystemStore.checkAuthentication()");
        // do nothing

    }

    public void commit(ITransaction transaction) throws WebdavException {
        // do nothing
        LOG.trace("LocalFileSystemStore.commit()");
    }

    public void rollback(ITransaction transaction) throws WebdavException {
        // do nothing
        LOG.trace("LocalFileSystemStore.rollback()");

    }

    public void createFolder(ITransaction transaction, String uri)
            throws WebdavException {
    	Log.d("createFolder","createFolder");
        LOG.trace("LocalFileSystemStore.createFolder(" + uri + ")");
        File file = new File(_root, uri);
        if (!file.exists() && !file.mkdir())
            throw new WebdavException("cannot create folder: " + uri);
        
        Log.d("createFolderSuccess","createFolderSuccess");
    }

    public void createResource(ITransaction transaction, String uri)
            throws WebdavException {
        LOG.trace("LocalFileSystemStore.createResource(" + uri + ")");
        File file = new File(_root, uri);
        try {
        	if(!file.exists()){  //�߰��κ�
            if (!file.createNewFile())
                throw new WebdavException("cannot create file: " + uri);
            if(!file.isDirectory())//�߰�
            	WebdavScan.scan(); //�߰�
        	}
        } catch (IOException e) {
            LOG.error("LocalFileSystemStore.createResource(" + uri
                            + ") failed");
            throw new WebdavException(e);
        }
    }

    public long setResourceContent(ITransaction transaction, String uri,
            InputStream is, String contentType, String characterEncoding)
            throws WebdavException {

        LOG.trace("LocalFileSystemStore.setResourceContent(" + uri + ")");
        File file = new File(_root, uri);
        try {
            OutputStream os = new BufferedOutputStream(new FileOutputStream(
                    file), BUF_SIZE);
            try {
                int read;
                byte[] copyBuffer = new byte[BUF_SIZE];

                while ((read = is.read(copyBuffer, 0, copyBuffer.length)) != -1) {
                    os.write(copyBuffer, 0, read);
                }
            } finally {
                try {
                    is.close();
                } finally {
                    os.close();
                }
            }
        } catch (IOException e) {
            LOG.error("LocalFileSystemStore.setResourceContent(" + uri
                    + ") failed");
            throw new WebdavException(e);
        }
        long length = -1;

        try {
            length = file.length();
        } catch (SecurityException e) {
            LOG.error("LocalFileSystemStore.setResourceContent(" + uri
                    + ") failed" + "\nCan't get file.length");
        }
        
        WebdavScan.scan(file); // �߰� �κ�
        
        return length;
    }

    public String[] getChildrenNames(ITransaction transaction, String uri)
            throws WebdavException {
        LOG.trace("LocalFileSystemStore.getChildrenNames(" + uri + ")");
        
        // �θ���, �ڽİ��
        File file = new File(_root, uri);
        String[] childrenNames = null;
        
        // ������ ���丮���
        if (file.isDirectory()) {
        	
        	// �ڽ� ���� �̾Ƴ���
            File[] children = file.listFiles();
            
            // �ڽ� ���� �� ���� ArrayList
            List<String> childList = new ArrayList<String>();
            
            String name = null;
            
            // �ڽ� ���� ���� ��ŭ ���鼭
            for (int i = 0; i < children.length; i++) {
            	// �����̸� �̾Ƽ�.. ArrayList�� ���
                name = children[i].getName();
                childList.add(name);
                LOG.trace("Child " + i + ": " + name);
            }
            
            // ���⼭ �� ������ �ϴ°���? 
            childrenNames = new String[childList.size()];
            childrenNames = (String[]) childList.toArray(childrenNames);
        }
        return childrenNames;
    }
    
    // �޼ҵ� �߰� �κ�
    public String getChildrenNums(ITransaction transaction, String uri) throws WebdavException {
        File file = new File(this._root, uri);
        String childrenNums = null; String totalFolderNums = null; String totalFileNums = null;
        File[] children = file.listFiles(this.sf);
        int fileNums = 0; int folderNums = 0;
        if (WebdavConfig._debug) LOG.trace("LocalFileSystemStore.getChildrenNums(" + uri + ")");
        if (children == null)
        {
          return childrenNums = "Unknown";
        }
        for (int i = 0; i < children.length; i++) {
          if (children[i].isDirectory()) {
            folderNums++;
          }
          else
          {
            fileNums++;
          }
        }
        totalFolderNums = Integer.toString(folderNums);
        totalFileNums = Integer.toString(fileNums);
        return childrenNums = totalFolderNums + " folder(s)" + " / " + totalFileNums + " file(s)";
      }
    
    
   // ���� ����
    public void removeObject(ITransaction transaction, String uri)
            throws WebdavException {
    	
        File file = new File(_root, uri);
        
        // ���� ���� �ϰ� �������� ���ϰ� true
        boolean success = file.delete();
        LOG.trace("LocalFileSystemStore.removeObject(" + uri + ")=" + success);
        if (!success) {
            throw new WebdavException("cannot delete object: " + uri);
        }

    }

    // ���� ������
    public boolean renameObject(ITransaction transaction, String sourceUri, String renameUri)
    {
      File fromFile = new File(this._root, sourceUri);
      File toFile = new File(this._root, renameUri);
      
      // ���ϰ� true or false
      return fromFile.renameTo(toFile);
    }
    
    
    public InputStream getResourceContent(ITransaction transaction, String uri)
            throws WebdavException {
        LOG.trace("LocalFileSystemStore.getResourceContent(" + uri + ")");
        File file = new File(_root, uri);

        InputStream in;
        try {
            in = new BufferedInputStream(new FileInputStream(file));
        } catch (IOException e) {
            LOG.error("LocalFileSystemStore.getResourceContent(" + uri
                    + ") failed");
            throw new WebdavException(e);
        }
        return in;
    }

    public long getResourceLength(ITransaction transaction, String uri)
            throws WebdavException {
        LOG.trace("LocalFileSystemStore.getResourceLength(" + uri + ")");
        File file = new File(_root, uri);
        return file.length();
    }

    public StoredObject getStoredObject(ITransaction transaction, String uri) {

        StoredObject so = null;

        File file = new File(_root, uri);
        
        //�߰��κ�
        if (WebdavConfig._debug) {
            LOG.trace("getStoredObject(" + uri + ", " + file.exists() + ")");
          }
        
        
        if (file.exists()) {
            so = new StoredObject();
            so.setFolder(file.isDirectory());
            so.setLastModified(new Date(file.lastModified()));
            so.setCreationDate(new Date(file.lastModified()));
            so.setResourceLength(getResourceLength(transaction, uri));
        }

        return so;
    }

}
