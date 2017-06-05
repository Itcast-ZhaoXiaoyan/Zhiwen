<?php
	header('Content-Type:text/html;charset=utf-8');
		
	//防止乱码，初始化设置；
	header('Content-Type:text/html;charset=utf-8');
	
	//数据库后台设置初始化；
	define('DB_HOST','localhost');
	define('DB_USER','root');
	define('DB_PWD','root');
	define('DB_NAME','zhiwen');
	
	//连接数据库，连接知问，设置字符集错误；
	$conn=@mysql_connect(DB_HOST,DB_USER,DB_PWD) or die('数据库连接失败：'.mysql_error());
	@mysql_select_db(DB_NAME) or die('数据库错误：'.mysql_error());
	@mysql_query('SET NAMES UTF8') or die('字符集错误：'.mysql_error());
?>