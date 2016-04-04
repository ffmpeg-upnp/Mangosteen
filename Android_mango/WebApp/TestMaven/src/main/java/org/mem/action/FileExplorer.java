package org.mem.action;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import android.content.ContentResolver;
import android.content.Context;
import android.util.Log;

import com.google.gson.Gson;

/**
 * Servlet implementation class FileExplorer
 */
public class FileExplorer extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private ContentResolver resolver = null;
	private Context context = null;

	// ��Ʈ ���丮 ����
	private String root = "/sdcard/";

	// ��� ���� ����

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FileExplorer() {
		super();
		// TODO Auto-generated constructor stub
	}

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		Log.d("FileExplorer.init", "�ù� ���Ծ�");
		this.resolver = (ContentResolver) getServletContext().getAttribute(
				"org.mem.mangosteen.contentResolver");
		this.context = (Context) getServletContext().getAttribute(
				"org.mem.mangosteen.context");
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		root = request.getParameter("dir");
		
		Log.d("FileExplorer.doPost","FileExplorer.doPost ����");
		
		Log.d("Request_RootDIR", root);
		
		try {
			getDir(root, request, response);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private void getDir(String rootDir, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Log.d("FileExplorer.getDir","FileExplorer.getDir ����");
		// dirPath ��ο� ���� File ��ü ���� �� ���� ���丮 ���� ��� ����
		
		response.setContentType("text/html;charset=utf-8");
		request.setCharacterEncoding("UTF-8");
		
		if (rootDir.charAt(rootDir.length()-1) == '\\') {
			rootDir = rootDir.substring(0, rootDir.length()-1) + "/";
		} else if (rootDir.charAt(rootDir.length()-1) != '/') {
			rootDir += "/";
		}
		
		PrintWriter pw = response.getWriter();
		
		rootDir = java.net.URLDecoder.decode(rootDir, "UTF-8");
		
		if (new File(rootDir).exists()) {
			String[] files = new File(rootDir).list(new FilenameFilter() {
			    public boolean accept(File dir, String name) {
					return name.charAt(0) != '.';
			    }
			});
			Arrays.sort(files, String.CASE_INSENSITIVE_ORDER);
			pw.print("<ul class=\"jqueryFileTree\" style=\"display: none;\">");
			// All dirs
			// ���丮�� ���� ȭ�鿡 �� �Ѹ���...
			// �ٵ� 2 ���� �±׿�...
			for (String file : files) {
			    if (new File(rootDir, file).isDirectory()) {
			    	
			    	Log.d("Directory", file);
			    	
			    	pw.print("<li class=\"directory collapsed\"><a href=\"javascript:;\" rel=\"" + rootDir + file + "/\">"
						+ file + "</a></li>");
			    }
			}
			// All files
			// ������ �Ѹ� �� MainFileView�� �Ѹ���.....
			
			for (String file : files) {
			    if (!new File(rootDir, file).isDirectory()) {
					int dotIndex = file.lastIndexOf('.');
					String ext = dotIndex > 0 ? file.substring(dotIndex + 1) : "";
					
					pw.print("<li class=\"file ext_" + ext + "\"><a href=\"javascript:;\" rel=\"" + rootDir + file + "\">"
						+ file + "</a></li>");
			    	}
			}
			pw.print("</ul>");
	    }

//		response.setContentType("text/html;charset=utf-8");
//		request.setCharacterEncoding("UTF-8");
//		Log.d("rootDir", rootDir);
//
//		String id = request.getParameter("id");
//		Log.d("id", id);
//
//		
//
//		File dir = new File(rootDir);
//
//		Gson gson = new Gson();
//
//		String json = gson.toJson(dir.listFiles());		
//		Log.d("fileEx", json);
//		
//		for (File file : dir.listFiles()) {
//			Log.d("fileName", file.getName());
//		}
//
////		if (dir.exists() && dir.isDirectory()) {
////			for (File file : dir.listFiles()) {
////
////			}
////		}
//		pw.write(json);
	}

}
